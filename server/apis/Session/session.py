from db import db_client
from flask import request, render_template
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from bson.objectid import ObjectId
from marshmallow import ValidationError, EXCLUDE
from apis.Menu.menu import MODEL_menu_item
from apis.Session.session_schema import SessionSchema
from apis.Session.order_schema import OrderSchema
from helpers.email_sender import EmailSender
import pprint


'''
*******************************************************************
Session Backend Service

API endpoints relating to handling user sessions when they use the
app. Sessions are used to mainly keep track of what the user has
ordered and provides context to admins regarding each order (who
ordered the items, which table an order belongs to,  etc.).
*******************************************************************
'''

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
    @session.doc(
        description='Get all active sessions', 
        responses={
            200: 'Success',
            204: 'No active sessions'
        })
    def get(self):
        sessions = []
        active_sessions = session_db.find({'active': True})

        if not active_sessions:
            return status.HTTP_204_NO_CONTENT

        for session in active_sessions:
            session['_id'] = str(session['_id'])
            sessions.append(session)
        
        return sessions, status.HTTP_200_OK


    @session.doc(
        description='Storing New Session',
        responses={
            201: 'Session created',
            400: 'Validation Error' 
        })
    @session.expect(MODEL_session)
    def post(self):
        schema = SessionSchema()
        try:
            session = schema.load(request.data)
            operation = session_db.insert_one(schema.dump(session))
            return {
                'session_id': str(operation.inserted_id)
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return {
                'result': 'Error in given session data.'
            }, status.HTTP_400_BAD_REQUEST


@session.route('/<string:session_id>')
class SessionInfo(Resource):
    @session.doc(
        description='Obtain Session Information',
        responses={
            200: 'Session found',
            404: 'Session not found'
        })
    def get(self, session_id):
        session = session_db.find_one({'_id': ObjectId(session_id)})
        
        if session is None:
            return status.HTTP_404_NOT_FOUND

        session['_id'] = str(session['_id'])
        return session, status.HTTP_200_OK
    

    @session.doc(
        description='Adding a New Order to a Session',
        responses={
            201: 'New order added to session',
            400: 'Validation error'
        })
    @session.expect(MODEL_order)
    def post(self, session_id):
        print('Adding a new order')
        schema = OrderSchema()
        try:
            order = schema.load(request.data, unknown=EXCLUDE)
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
            return status.HTTP_400_BAD_REQUEST


    @session.doc(description='Closing all orders for a session.')
    def patch(self, session_id):
        session_db.update_one(
            {'_id': ObjectId(session_id)},
            {'$set': {'order_list.$[].status': 'Completed'}}
        )
        return {
            'updated': session_id
        }, status.HTTP_200_OK


@session.route('/order')
class ActiveOrders(Resource):
    @session.doc(description='Get all active session orders')
    def get(self):
        orders = []
        active_sessions = session_db.find({ 
            '$and': [
                { 'active': True }, 
                { 'order_list': { '$not': { '$size': 0 } } } 
            ]
        })

        for session in active_sessions:
            for order in session['order_list']:
                order['table_id'] = session['table_id']
                order['user_id'] = session['user_id']
                orders.append(order)

        return sorted(orders, key=lambda k: k['timestamp'], reverse=True), status.HTTP_200_OK


@session.route('/table/<string:table_id>')
class ActiveTableSession(Resource):
    @session.doc(description='Get active session for a table')
    def get(self, table_id):
        active_session = session_db.find_one({ 
            '$and': [
                { 'table_id': table_id },
                { 'active': True }, 
                { 'order_list': { '$not': { '$size': 0 } } } 
            ]
        })

        if active_session is None:
            return status.HTTP_404_NOT_FOUND

        active_session['_id'] = str(active_session['_id'])
        return active_session


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
        session_db.update_one(
            {'order_list._id': order_id},
            {'$set': {'order_list.$.status': new_status}}
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
        # Deactivate session as it is complete
        session_db.find_one_and_update(
            {'_id': ObjectId(request.data['session_id'])},
            {'$set': {'active': False}}
        )

        # Get user and session details from database
        session = session_db.find_one({'_id': ObjectId(request.data['session_id'])})
        user = auth_db.find_one({'_id': ObjectId(session['user_id'])})

        # Prepare receipt context based on order details
        email = EmailSender().prepare_receipt_email(session, user)
        EmailSender().send_email(user['email'], email)

        return {
            'result': 'Email sent to ' + user['email'] + ' successfully'
        }, status.HTTP_200_OK