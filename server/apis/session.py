from db import db_client
from flask import request, render_template
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from bson.objectid import ObjectId
from marshmallow import ValidationError
from apis.order import MODEL_order
from apis.session_schema import SessionSchema
from helpers.email_sender import EmailSender


session = Namespace('sessions', description='Session Backend Service')
session_db = db_client.session
auth_db = db_client.auth


MODEL_session = session.model('Session Schema', {
    'table_id': fields.String(),
    'timestamp': fields.DateTime(dt_format='%d-%m-%YT%H:%M:%S'),
    'user_id': fields.String(),
    'order_list': fields.List(fields.Nested(MODEL_order))
})

MODEL_session_id = session.model('Session ID', {
    'session_id': fields.String()
})

@session.route('')
class SessionRoute(Resource):
    @session.doc(description='Storing New Session')
    @session.expect(MODEL_session)
    def post(self):
        schema = SessionSchema()
        try:
            session = schema.load(request.data)
            operation = session_db.insert_one(schema.dump(session))
            return {
                'inserted': str(operation.inserted_id)
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return {
                'result': 'Error in given session data.'
            }, status.HTTP_400_BAD_REQUEST


@session.route('/<string:session_id>')
class SessionInfo(Resource):
    @session.doc(description='Obtain Session Information')
    def get(self, session_id):
        session = session_db.find_one({'_id': ObjectId(session_id)})
        session['_id'] = str(session['_id'])
        return session, status.HTTP_200_OK


@session.route('/receipt')
class SessionReceiptRoute(Resource):
    @session.doc(description='Sending a Customer Receipt for their Session at Restaurant')
    @session.expect(MODEL_session_id)
    def post(self):
        # Get user and session details from database
        session = session_db.find_one({'_id': ObjectId(request.data['session_id'])})
        user = auth_db.find_one({'_id': session['user_id']})

        # Populate Email Context using Order Details
        email_context = {
            'name': user['name'],
            'restaurant': 'Cho Cho San',
            'order_id': session['_id'],
            'order_items': [],
            'total_price': 0
        }

        for orders in session['order_list']:
            for item in orders['order_items']:
                email_context['order_items'].append({
                    'name': item['menu_item']['name'],
                    'quantity': item['quantity'],
                    'unit_price': item['menu_item']['price']
                })

        subtotals = [order_item['quantity'] * order_item['unit_price'] for order_item in email_context['order_items']]
        email_context['total_price'] = sum(subtotals)

        email = {
            'text': '', # Insert the text version of the receipt we want to send
            'html': render_template('receipt.html', context=email_context)
        }

        EmailSender().send_email('artemisproject28+test@gmail.com', email['text'], email['html'])