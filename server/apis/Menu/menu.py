from flask import request
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from marshmallow import ValidationError
from bson.objectid import ObjectId
from datetime import datetime
from db import db_client
from apis.Menu.menu_schema import MenuItemSchema, MenuCategorySchema, MenuReviewSchema
import json
import pprint


'''
*******************************************************************
Menu Backend Service

API endpoints relating to handling the restaurant's menu. Features
CRUD operations for menu categories and menu items. Also handles 
reviews and ratings for the menu items.
*******************************************************************
'''


menu_db = db_client.menu
menu = Namespace('menu', description='Menu Backend Service')

MODEL_menu_category = menu.model('Menu Category', {
    'name': fields.String()
})

MODEL_menu_item = menu.model('Menu Item', {
    'name': fields.String(),
    'description': fields.String(),
    'media_urls': fields.String(),
    'price': fields.Float(),
    'chefs_pick': fields.Boolean(default=False)
})

MODEL_menu_uuid = menu.model('Menu Item ID', {
    'id': fields.String(description="ID of the Menu Item", required=True)
})

MODEL_menu_recommendation = menu.model('Menu Item Recommendation', {
    'chefs_pick': fields.Boolean(default=True)
})

@menu.route('')
class MenuRoute(Resource):
    @menu.doc(description='Get all items on the Menu')
    def get(self):
        menu_items = list(menu_db.find({}))
        for menu_item in menu_items:
            menu_item['_id'] = str(menu_item['_id'])
        return menu_items, status.HTTP_200_OK


    @menu.doc(description='Inserting a new Menu category')
    @menu.expect(MODEL_menu_category)
    def post(self):
        schema = MenuCategorySchema()
        try:
            menu_category = schema.load(request.data)
            operation = menu_db.insert_one(schema.dump(menu_category))
            return {
                'inserted': str(operation.inserted_id)
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return {
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST


@menu.route('/category/<string:category_id>')
class MenuCategoryRoute(Resource):
    @menu.doc(description='Get Menu Category Details')
    def get(self, category_id):
        menu_category = menu_db.find_one({'_id': ObjectId(category_id)})
        menu_category['_id'] = str(menu_category['_id'])
        return menu_category, status.HTTP_200_OK


    @menu.doc(description='Edit Menu Category Details')
    @menu.expect(MODEL_menu_category)
    def patch(self, category_id):
        schema = MenuCategorySchema()
        try:
            new_category = schema.load(request.data)
            menu_db.update_one(
                {'_id': ObjectId(category_id)},
                {'$set':
                    {'name': new_category['name']}
                }
            )
            return {'updated': category_id}, status.HTTP_200_OK
        except ValidationError as err:
            print(err)
            return {
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST


    @menu.doc(description='Add Menu Item to Menu Category')
    @menu.expect(MODEL_menu_item)
    def post(self, category_id):
        schema = MenuItemSchema()
        try:
            menu_item = schema.load(request.data)
            # Generates a unique id manually for each menu item
            menu_item['_id'] = str(ObjectId())
            menu_db.update(
                {'_id': ObjectId(category_id)},
                {'$push': {'menu_items': schema.dump(menu_item)}}
            )
            return {
                'inserted': schema.dump(menu_item)
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return {
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST


    @menu.doc(description='Deleting a Menu Category')
    def delete(self, category_id):
        menu_db.delete_one({'_id': ObjectId(category_id)})
        return {
            'deleted': category_id
        }, status.HTTP_200_OK


@menu.route('/item/<string:item_id>')
class MenuItemRoute(Resource):
    @menu.doc(description='Getting Info on a Menu Item')
    def get(self, item_id):
        menu_item = menu_db.find_one({'menu_items._id': item_id})
        menu_item['_id'] = str(menu_item['_id'])
        return menu_item, status.HTTP_200_OK


    @menu.doc(description='Deleting a Menu Item')
    def delete(self, item_id):
        deleted = menu_db.update(
            {'menu_items._id': item_id},
            {'$pull': {'menu_items': {'_id': item_id}}}
        )
        if(deleted['nModified']==0):
            return{
                'deleted': 'not found'
            }, status.HTTP_404_NOT_FOUND
        return {
            'deleted': 'success'
        }, status.HTTP_200_OK


    @menu.doc(description='Updating a Menu Item')
    @menu.expect(MODEL_menu_item)
    def put(self, item_id):
        schema = MenuItemSchema()
        updated_menu_item = schema.load(request.data)
        # Ensures we are not losing the id of the original item we are updating
        updated_menu_item['_id'] = item_id

        menu_db.update(
            {'menu_items._id': item_id}, 
            {'$set':{'menu_items.$.name': updated_menu_item['name'],
                     'menu_items.$.description': updated_menu_item['description'],
                     'menu_items.$.media_urls': updated_menu_item['media_urls'],
                     'menu_items.$.price': updated_menu_item['price'],
                     'menu_items.$.chefs_pick': updated_menu_item['chefs_pick']}}
        )
        return {
            'updated': schema.dump(updated_menu_item),
        }, status.HTTP_200_OK


@menu.route('/recommendations')
class MenuRecommendationList(Resource):
    @menu.doc(description='Getting all recommended items on the Menu')
    def get(self):
        categories = list(menu_db.find({}))
        res = list()
        for cat in categories:
            for menu_item in cat['menu_items']:
                if menu_item['chefs_pick'] == True:
                    res.append(menu_item)
        return res, status.HTTP_200_OK


@menu.route('/recommendations/<string:item_id>')
class MenuRecommendationRoute(Resource):
    @menu.doc(description='Adding a Menu Item to Recommendations')
    def patch(self, item_id):
        try:
            menu_db.update_one(
                {'menu_items._id': item_id},
                {'$set':
                    {'menu_items.$.chefs_pick': True}
                 }
            )
            return {'updated': item_id}, status.HTTP_200_OK
        except ValidationError as err:
            print(err)
            return {
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST


    @menu.doc(description='Removing a Menu Item from Recommendations')
    def delete(self, item_id):
        try:
            menu_db.update_one(
                {'menu_items._id': item_id},
                {'$set':
                    {'menu_items.$.chefs_pick': False}
                 }
            )
            return {'deleted': item_id}, status.HTTP_200_OK
        except ValidationError as err:
            print(err)
            return {
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST
