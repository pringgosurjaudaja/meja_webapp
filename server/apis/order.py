from db import db_client
from flask import request, jsonify
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from marshmallow import ValidationError
from apis.order_schema import OrderSchema, OrderItemSchema

order = Namespace('order', description='Order Backend Service')
order_db = db_client.order
order_items_db = db_client.order_items

MODEL_order = order.model('Order',{
    'table_id' : fields.String()
})

MODEL_order_id = order.model('Order ID',{
    'id': fields.String()
})

MODEL_order_item = order.model('Order Item',{
    'menu_item_id' : fields.String(),
    'amount' : fields.Float(),
    'notes' : fields.String(),
    'status' : fields.Boolean(),
    'order_id' : fields.String()
})

@order.route('order/<string:id>')
class OrderManage(Resource):
    @order.doc(description='View the Order Items in the Order, given order ID')
    def get(self, id):
        order_items = list(order_items_db.find({'order_id': id}))
        for order_item in order_items:
            order_item['_id'] = str(order_item['_id'])
        return order_items, status.HTTP_200_OK

@order.route('')
class Order(Resource):
    @order.doc(description='Creating new Order')
    @order.expect(MODEL_order)
    def post(self):
        schema = OrderSchema()
        # table_id = request.data.get('table_id')
        order = schema.load(request.data)
        order['orderItems_id'] = []
        operation = order_db.insert_one(schema.dump(order))
        return{'inserted': str(operation.inserted_id)}, status.HTTP_201_CREATED
    @order.doc(description='Deleting an order and  the  order items in it')
    @order.expect(MODEL_order_id)
    def delete(self):
        order_id = request.data.get('id')
        # order_deleted = order_db.find({'_id':ObjectId(order_id)})
        op = order_db.delete_one({'_id':ObjectId(order_id)})
        op2 = order_items_db.delete_many({'order_id':order_id})
        print(op.deleted_count)
        if op.deleted_count == 0:
            return{'result' : 'No items'}, 200
        return{'deleted':op.raw_result}, status.HTTP_204_NO_CONTENT


@order.route('/add')
class OrderItem(Resource):
    @order.doc(description='Putting menu item in the order')
    @order.expect(MODEL_order_item)
    def post(self):
        schema = OrderItemSchema()
        try:
            order_item = schema.load(request.data)
            operation = order_items_db.insert_one(schema.dump(order_item))
            order_no = request.data.get('order_id')
            print(operation.inserted_id)
            order_db.update_one({'_id': ObjectId(order_no)},
                {"$push":{'orderItems_id':operation.inserted_id}})
            return {'ordered': str(operation.inserted_id)}, status.HTTP_201_CREATED
        except ValidationError as error:
            print(error)
            return{'result': 'Missing fields'}, status.HTTP_400_BAD_REQUEST

@order.route('/orderitem/<string:id>')
class OrderItemGet(Resource):
    @order.doc(description='Get the Order Item')
    def get(self, id):
        order_item = order_items_db.find_one({'_id': id})
        return order_item, status.HTTP_200_OK