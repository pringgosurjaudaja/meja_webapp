from db import db_client
from flask import request, jsonify
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from apis.menu_schema import MenuItem, MenuItemSchema
from marshmallow import ValidationError

menu = Namespace('menu', description='Menu Backend Service')
parser = reqparse.RequestParser()
menu_db = db_client.menu

MODEL_menu_item = menu.model('Menu Item', {
    'name': fields.String(),
    'description': fields.String(),
    'media_urls': fields.List(fields.String()),
    'price': fields.Float(),
    'labels': fields.List(fields.Integer()),
    'tags': fields.List(fields.String()),
    'chefs_pick': fields.Boolean(default=False)
})

MODEL_menu_uuid = menu.model('Menu Item ID', {
    'id': fields.String(description="ID of the Menu Item", required=True)
})

@menu.doc(description='Endpoints for whole Menu Operations')
@menu.route('')
class Menu(Resource):
    @menu.doc(description='Get all items on the Menu')
    def get(self):
        menu_items = list(menu_db.find({}))
        for menu_item in menu_items:
            menu_item['_id'] = str(menu_item['_id'])
        return menu_items, status.HTTP_200_OK


# Menu Item Endpoints
@menu.route('/item')
class MenuItemRoute(Resource):
    @menu.doc(description='Getting Info on a Menu Item')
    @menu.expect(MODEL_menu_uuid)
    # @menu.marshal_with(MODEL_menu_item)
    def get(self):
        menu_item_id = request.data.get('id')
        # Gets menu_item and excludes the id from the result
        menu_item = menu_db.find_one({'_id': ObjectId(menu_item_id)})
        menu_item['_id'] = str(menu_item['_id'])
        return menu_item, status.HTTP_200_OK


    @menu.doc(description='Inserting a new Menu Item')
    @menu.expect(MODEL_menu_item)
    def post(self):
        schema = MenuItemSchema()
        try:
            menu_item = schema.load(request.data)
            operation = menu_db.insert_one(schema.dump(menu_item))
            return { 'inserted': str(operation.inserted_id)}, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return { 
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST


    @menu.doc(description='Deleting a Menu Item')
    @menu.expect(MODEL_menu_uuid)
    def delete(self):
        menu_item_id = request.data.get('id')
        operation = menu_db.delete_one({'_id': ObjectId(menu_item_id)})
        if operation.deleted_count == 0:
            # No menu items deleted
            return {'result': 'No items deleted'}, 200
        return {
            'deleted': operation.raw_result
        }, status.HTTP_204_NO_CONTENT


    @menu.doc(description=('Replacing a Menu Item. When Editing, expects' 
                           'a full new menu item with the updated details'))
    @menu.expect(MODEL_menu_item)
    def put(self):
        menu_item_id = request.data.get('id')
        schema = MenuItemSchema()
        updated_menu_item = schema.load(request.data)
        updated_json = schema.dump(updated_menu_item)
        operation = menu_db.replace_one({'_id': ObjectId(menu_item_id)}, updated_json)
        if operation.matched_count == 0:
            return {'result': 'Menu item not found'}, 200

        return {
            'updated': 'success',
        }, status.HTTP_200_OK
