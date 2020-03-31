from db import db_client
from flask import request, render_template
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from bson.objectid import ObjectId
from marshmallow import ValidationError
from apis.menu import MODEL_menu_item
from apis.session_schema import SessionSchema
from apis.order_schema import OrderSchema
from helpers.email_sender import EmailSender


session = Namespace('session', description='Session Backend Service')
session_db = db_client.session
auth_db = db_client.auth

# Matched to order status enum from frontend
ORDER_STATUS = {
    'ORDERED': 'Ordered',
    'PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
}

MODEL_order_item = session.model('Order Item Schema', {
    'menuItem': fields.Nested(MODEL_menu_item),
    'quantity': fields.Integer(),
    'notes': fields.String()
})

MODEL_order = session.model('Order Schema', {
    'status': fields.String(),
    'orderItems': fields.List(fields.Nested(MODEL_order_item))
})

MODEL_order_status = session.model('Order Status Schema', {
    'status': fields.String()
})

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
    
    @session.doc(description='Adding a New Order to a Session')
    @session.expect(MODEL_order)
    def post(self, session_id):
        print('Adding a new order')
        schema = OrderSchema()
        try:
            order = schema.load(request.data)
            # Generate an order id
            order['_id'] = str(ObjectId())
            session_db.update(
                {'_id': ObjectId(session_id)},
                {'$push': {'order_list': schema.dump(order)}}
            )
            return {
                'inserted': schema.dump(order)
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return {
                'result': 'Error in given order data'
            }, status.HTTP_400_BAD_REQUEST


@session.route('/order/<string:order_id>')
class OrderInfo(Resource):
    @session.doc(description='Get Info on an Order')
    def get(self, order_id):
        session = session_db.find_one({'order_list._id': order_id})

        if session is None:
            return {
                'result': 'Did not find order with id ' + order_id
            }, status.HTTP_200_OK

        for order in session['order_list']:
            if order['_id'] == order_id:
                return order, status.HTTP_200_OK 

    
    @session.doc(description="Updating an Order")
    @session.expect(MODEL_order_status)
    def patch(self, order_id):
        new_status = request.data['status']
        
        session_db.find_one_and_update(
            {'order_list._id': order_id},
            {'$set': {'status': new_status}}
        )

        return { 'updated': order_id }, status.HTTP_200_OK
    
    @session.doc(description='Deleting an Order')
    def delete(self, order_id):
        session_db.update(
            {},
            {'$pull': {'order_list': {'_id': order_id}}}
        )
        return { 'deleted': 'success' }, status.HTTP_200_OK


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