from db import db_client
from flask import request, jsonify, render_template
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from marshmallow import ValidationError
from apis.order_schema import OrderSchema, OrderItemSchema
from helpers.email_sender import EmailSender
# from apis.menu import menu_db


order = Namespace('orders', description='Order Backend Service')
order_db = db_client.order
order_items_db = db_client.order_items
menu_db = db_client.menu

MODEL_order = order.model('Order', {
    'table_id' : fields.String()
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
    'notes' : fields.String()
})

MODEL_order_receipt = order.model('Order Receipt',{

})

@order.route('/<string:id>')
class OrderManage(Resource):
    @order.doc(description='View Order, given order ID')
    def get(self, id):
        order_items = list(order_db.find({'_id': ObjectId(id)}))
        return order_items, status.HTTP_200_OK

@order.route('')
class Order(Resource):
    @order.doc(description='View all order')
    def get(self):
        orders = list(order_db.find({}))
        for order in orders:
            order['_id'] = str(order['_id'])
        return orders, status.HTTP_200_OK

    @order.doc(description='Creating new Order')
    @order.expect(MODEL_order)
    def post(self):
        schema = OrderSchema()
        # table_id = request.data.get('table_id')
        order = schema.load(request.data)
        order['status'] = 'pending'
        operation = order_db.insert_one(schema.dump(order))
        return{'inserted': str(operation.inserted_id)}, status.HTTP_201_CREATED

    @order.doc(description='Deleting an order and  the  order items in it')
    @order.expect(MODEL_order_id)
    def delete(self):
        order_id = request.data.get('id')
        # order_deleted = order_db.find({'_id':ObjectId(order_id)})
        op = order_db.delete_one({'_id':ObjectId(order_id)})
        if op.deleted_count == 0:
            return{'result' : 'No items'}, 200
        return{'status':'deleted'}, status.HTTP_204_NO_CONTENT

    @order.doc(description='Edit the status of the Order')
    @order.expect(MODEL_status)
    def put(self):
        status_collection = {'pending', 'cooking', 'done', 'delivering'}
        new_status = request.data.get('status')
        if(new_status.lower() in status_collection):
            order_db.update_one({'_id': ObjectId(request.data.get('order_id'))},{'$set': {'status': new_status}})
            return{'result': 'Status Changed'}, 200
        else:
            return{'result': 'Status Invalid. Valid Status: pending, cooking, done, delivering'}, status.HTTP_400_BAD_REQUEST


@order.route('/<string:order_id>')
class OrderItem(Resource):
    @order.doc(description='Putting menu item in the order')
    @order.expect(MODEL_order_item)
    def post(self, order_id):
        schema = OrderItemSchema()
        try:
       
        
            order_item = schema.load(request.data)
            menu_item_id = order_item['menu_item_id']

            menu_item_queried = menu_db.aggregate([
                {'$unwind': '$menu_items'},
                {'$match':{"menu_items._id": menu_item_id}},
                
                {'$project': {'_id':"$menu_items._id",
                            'name': '$menu_items.name',
                            'price': '$menu_items.price'
                }}
        ])
            menu_item = menu_item_queried.next()
            
            # print(order_item['menu_item_id'])
            order_item['order_id'] = order_id
            order_item['menu_item_name'] = menu_item['name']
            order_item['menu_item_price']= menu_item['price']
            order_db.update_one({'_id': ObjectId(order_id)},
                {"$push":{'orderItems':schema.dump(order_item)}})
            return order_item, status.HTTP_201_CREATED
       
        except ValidationError as error:
            print(error)
            return{'result': 'Missing fields'}, status.HTTP_400_BAD_REQUEST

# @order.route('/item/<string:id>')
# class OrderItemGet(Resource):
#     @order.doc(description='Get the Order Item')
#     def get(self, id):
#         order_item = order_items_db.find_one({'_id': id})
#         return order_item, status.HTTP_200_OK


@order.route('/receipt')
class OrderReceiptRoute(Resource):
    @order.expect(MODEL_order_id)
    def post(self):
        # Get order details from database
        order = order_db.find_one({ '_id': ObjectId(request.data['id'])})
        
        # {
        #             'name': 'Chicken Schnitzel',
        #             'quantity': 2,
        #             'unit_price': 12.50
        #         }
        # Populate Email Context using Order Details
        email_context = {
            'name': 'Sebastian Chua',
            'restaurant': 'Cho Cho San',
            'order_id': order['_id'],
            'order_items': [
                
            ],
            'total_price': 0
        }
        for x in order['orderItems']:
            dict= {}
            dict['name'] = x['menu_item_name']
            dict['quantity'] = x['amount']
            dict['unit_price']= x['menu_item_price']
            email_context['order_items'].append(dict.copy())
        for z in email_context['order_items']:
            email_context['total_price'] = email_context['total_price'] + (z['quantity'] * z['unit_price'])
        print(email_context)
        email = {
            'text': '', # Insert the text version of the receipt we want to send
            'html': render_template('receipt.html', context=email_context)
        }

        EmailSender().send_email('artemisproject28+test@gmail.com', email['text'], email['html'])