from db import db_client
from flask import request, jsonify
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from marshmallow import ValidationError
from apis.order_schema import OrderSchema, OrderItemSchema
# from apis.menu import menu_db

order = Namespace('orders', description='Order Backend Service')
order_db = db_client.order
order_items_db = db_client.order_items
menu_db = db_client.menu

MODEL_order = order.model('Order',{
        'table_id' : fields.String()
})

MODEL_status = order.model('Order Status', {
    'status' : fields.String(),
    'order_id' : fields.String()
})
MODEL_order_id = order.model('Order ID',{
    'id': fields.String()
})

MODEL_order_item = order.model('Order Item',{
    'menu_item_id' : fields.String(),
    'amount' : fields.Float(),
    'notes' : fields.String()
})

@order.route('/<string:id>')
class OrderManage(Resource):
    @order.doc(description='View Order, given order ID')
    def get(self, id):
        order_items = list(order_items_db.find({'order_id': id}))
        for order_item in order_items:
            order_item['_id'] = str(order_item['_id'])
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