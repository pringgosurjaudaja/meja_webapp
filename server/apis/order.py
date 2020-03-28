from db import db_client
from flask import request
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from bson.objectid import ObjectId
from marshmallow import ValidationError
from apis.menu import MODEL_menu_item
from apis.order_schema import OrderSchema, OrderItemSchema

order = Namespace('order', description='Order Backend Service')
order_db = db_client.order


MODEL_order_item = order.model('Order Item Schema', {
    'menuItem': fields.Nested(MODEL_menu_item),
    'quantity': fields.Integer(),
    'notes': fields.String()
})

MODEL_order = order.model('Order Schema', {
    'tableId': fields.String(),
    'status': fields.String(),
    'orderItems': fields.List(fields.Nested(MODEL_order_item))
})

MODEL_order_status = order.model('Order Status Schema', {
    'status': fields.String()
})


@order.route('')
class OrderRoute(Resource):
    @order.doc(description='Adding a New Order')
    @order.expect(MODEL_order)
    def post(self):
        print('Adding a new order')
        schema = OrderSchema()
        try:
            order = schema.load(request.data)
            print(order)
            operation = order_db.insert_one(schema.dump(order))
            return {
                'inserted': str(operation.inserted_id)
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return {
                'result': 'Error in given order data'
            }, status.HTTP_400_BAD_REQUEST

@order.route('/<string:order_id>')
class OrderInfo(Resource):
    @order.doc(description='Get Info on an Order')
    def get(self, order_id):
        order = order_db.find_one({'_id': ObjectId(order_id)})
        order['_id'] = str(order['_id'])
        return order, status.HTTP_200_OK
    
    @order.doc(description="Updating an Order")
    @order.expect(MODEL_order_status)
    def patch(self, order_id):
        new_status = request.data['status']
        
        order_db.find_one_and_update(
            {'_id': ObjectId(order_id)},
            {'$set': {'status': new_status}}
        )

        return { 'updated': order_id }, status.HTTP_200_OK
    
    @order.doc(description='Deleting an Order')
    def delete(self, order_id):
        order_db.update(
            {},
            {'$pull': {'_id': ObjectId(order_id)}}
        )
        return { 'deleted': 'success' }, status.HTTP_200_OK
