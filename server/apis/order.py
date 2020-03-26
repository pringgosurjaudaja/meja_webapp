from db import db_client
from flask import request, jsonify, render_template
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from marshmallow import ValidationError
from apis.order_schema import OrderSchema, OrderItemSchema, SessionSchema
from helpers.email_sender import EmailSender
import random
# from apis.menu import menu_db


order = Namespace('orders', description='Order Backend Service')
order_db = db_client.order
order_items_db = db_client.order_items
menu_db = db_client.menu
session_db = db_client.session
auth_db = db_client.auth

MODEL_order = order.model('Order', {
    'table_id' : fields.String()
})

MODEL_order_session = order.model('Schema',{
    'session_id': fields.String()
})

MODEL_order_id = order.model('Order ID', {
    'id': fields.String()
})

MODEL_status = order.model('Order Status', {
    'status' : fields.String(),
    'order_id' : fields.String()
})

MODEL_order_item = order.model('Order Item', {
    'menu_item_id' : fields.String(),
    'amount' : fields.Float(),
    'notes' : fields.String(),
    'order_id': fields.String()
})

MODEL_order_receipt = order.model('Order Receipt',{

})
MODEL_session = order.model('Session', {
    'table_id' : fields.String(),
    'user' : fields.String(),
    'orderList' : fields.List(fields.Nested(OrderSchema), missing = []),
    'datetime_visit' : fields.DateTime(format= '%d-%m-%YT%H:%M:%S')
})

@order.route('/<string:session_id>')
class OrderManage(Resource):
    @order.doc(description='View Order, given session ID')
    def get(self, session_id):
        orders = list(session_db.find({'_id': ObjectId(session_id)}))
        for x in orders:
            x['_id'] = str(x['_id'])
        # orders['_id'] = str(orders['_id'])
        return orders, status.HTTP_200_OK

@order.route('')
class Order(Resource):
    # @order.doc(description='View all order in current session')
    # def get(self):
    #     orders = session_db.find({'_id': ObjectId(request.data.get('session_id'))})
    #     orders['_id'] = str(orders['_id'])
    #     return orders, status.HTTP_200_OK

    @order.doc(description='Creating new Order')
    @order.expect(MODEL_order_session)
    def post(self):
        schema = OrderSchema()
        # table_id = request.data.get('table_id')
        session = session_db.find_one({'_id': ObjectId(request.data.get('session_id'))})
        order = schema.load({'_id': str(random.randint(1,1000)),'table_id': session['table_id'] })
        operation = session_db.update_one({'_id': ObjectId(request.data.get('session_id'))},
        {'$push': {'orderList': schema.dump(order)}})
        # operation = order_db.insert_one(schema.dump(order))
        return{'inserted': str(operation.upserted_id)}, status.HTTP_201_CREATED

    # @order.doc(description='Deleting an order and  the  order items in it')
    # @order.expect(MODEL_order_id)
    # def delete(self):
    #     order_id = request.data.get('id')
    #     # order_deleted = order_db.find({'_id':ObjectId(order_id)})
    #     # op = order_db.delete_one({'_id':ObjectId(order_id)})
    #     op = session_db.update_one({'_id': ObjectId(order_id)},
    #     {'$pull':{'orderList': {'_id': ObjectId(order_id)}}})
    #     if op.deleted_count == 0:
    #         return{'result' : 'No items'}, 200
    #     return{'status':'deleted'}, status.HTTP_204_NO_CONTENT

@order.route('/<string:session_id>')
class OrderItem(Resource):
    @order.doc(description='Putting menu item in the order')
    @order.expect(MODEL_session)
    def post(self, session_id):
        schema = SessionSchema()
        try:
            session_item = schema.load(request.data)
            operation = session_db.insert_one(schema.dump(session_item))
            return{'inserted': str(operation.inserted_id)},status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return{
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST
        # schema = OrderItemSchema()
        # try:
       
        
        #     order_item = schema.load(request.data)
        #     menu_item_id = order_item['menu_item_id']

        #     menu_item_queried = menu_db.aggregate([
        #         {'$unwind': '$menu_items'},
        #         {'$match':{"menu_items._id": menu_item_id}},
                
        #         {'$project': {'_id':"$menu_items._id",
        #                     'name': '$menu_items.name',
        #                     'price': '$menu_items.price'
        #         }}
        # ])
        #     menu_item = menu_item_queried.next()
            
        #     # print(order_item['menu_item_id'])
        #     order_item['menu_item_name'] = menu_item['name']
        #     order_item['menu_item_price']= menu_item['price']
        #     # order_db.update_one({'_id': ObjectId(order_id)},
        #     #     {"$push":{'orderItems':schema.dump(order_item)}})
        #     session_db.update_one({'_id': ObjectId(session_id),'orderList._id': order_item['order_id']},{'$push':{'orderList.$.orderItems': schema.dump(order_item)}})
        #     return order_item, status.HTTP_201_CREATED
       
        # except ValidationError as error:
        #     print(error)
        #     return{'result': 'Missing fields'}, status.HTTP_400_BAD_REQUEST


@order.route('/receipt')
class OrderReceiptRoute(Resource):
    @order.expect(MODEL_order_session)
    def post(self):
        # Get order details from database
        # order = order_db.find_one({ '_id': ObjectId(request.data['id'])})
        session = session_db.find_one({'_id': ObjectId(request.data['session_id'])})
        user = auth_db.find_one({'email': session['user']})
        # Populate Email Context using Order Details
        email_context = {
            'name': user['name'],
            'restaurant': 'Cho Cho San',
            'order_id': session['_id'],
            'order_items': [],
            'total_price': 0
        }

        for orders in session['orderList']:
            for x in orders['orderItems']:
                email_context['order_items'].append({'name': x['menu_item_name'],
                'quantity': x['amount'], 'unit_price': x['menu_item_price']})

        # email_context['order_items'] = [{
        #     'name': order_item['menu_item_name'],
        #     'quantity': order_item['amount'],
        #     'unit_price': order_item['menu_item_price']
        # } for order_item in order['orderItems']]

        email_context['total_price'] = sum(order_item['quantity'] * order_item['unit_price'] for order_item in email_context['order_items'])

        email = {
            'text': '', # Insert the text version of the receipt we want to send
            'html': render_template('receipt.html', context=email_context)
        }

        EmailSender().send_email('artemisproject28+test@gmail.com', email['text'], email['html'])