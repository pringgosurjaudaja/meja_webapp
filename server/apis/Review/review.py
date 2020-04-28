from db import db_client
from flask import request, jsonify, render_template
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
import requests
from marshmallow import ValidationError
from apis.Review.review_schema import ReviewSchema, ReviewReply
from datetime import datetime
from apis.Menu.menu_schema import MenuReviewSchema
from config.zomato import config as zomato_config


'''
*******************************************************************
Reviews Backend Service

API endpoints to obtain reviews on the restaurant and menu items.
Contacts Zomato API as well to obtain additional community reviews.
*******************************************************************
'''


review = Namespace('review', description='Review Backend Service')
review_db = db_client.review
menu_db = db_client.menu
menu_review_db = db_client.menu_review

MODEL_review = review.model('Review', {
    'review': fields.String(),
    'rating': fields.Integer(),
    'user': fields.String()  
})

MODEL_reply = review.model('Review Reply',{
    'reply': fields.String(),
    'user' : fields.String()
})

MODEL_menu_review_id = review.model('Menu review id',{
    '_id': fields.String()
})

MODEL_menu_review = review.model('Menu Item Review',{
    'user': fields.String(),
    'rating': fields.Integer(),
    'comment': fields.String()
})

@review.route('')
class Review(Resource):
    @review.doc(description='Get all reviews')
    def get(self):
        reviews = list(review_db.find({}))
        for review in reviews:
            review['_id'] = str(review['_id'])
        return reviews, status.HTTP_200_OK


    @review.expect(MODEL_review)
    @review.doc(description='Create new review')
    def post(self):
        schema = ReviewSchema()
        try:
            review = schema.load(request.data)
            now = datetime.now()
            review['date_time'] = now
            print(review)
            operation = review_db.insert_one(schema.dump(review))
            review['date_time'] = str(review['date_time'])
            review_return = {
                '_id': str(operation.inserted_id),
                "user": review['user'],
                "review": review['review'],
                "rating": review['rating'],
                "date_time": str(review['date_time'])
            }
            return review_return, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return{
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST


@review.route('/<string:review_id>')
class ReviewAction(Resource):
    @review.doc(description='Delete a review')
    def delete(self, review_id):
        try:
            review_db.delete_one({'_id': ObjectId(review_id)})
            return { 'result': 'review deleted'}, status.HTTP_200_OK
        except ValidationError as err:
            print(err)
            return{
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST


    @review.doc(description='Reply to a review')
    @review.expect(MODEL_reply)
    def post(self, review_id):
        schema = ReviewReply()
        try:
            review_reply = schema.load(request.data)
            now = datetime.now()
            review_reply['date_time'] = now
            review_db.update(
                {'_id': ObjectId(review_id)},
                {'$push': {'replies': schema.dump(review_reply)}})
            return{
                'inserted': schema.dump(review_reply)
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return{'result': 'Missing required fields'}, status.HTTP_400_BAD_REQUEST

@review.route('/menu_items/<string:menu_item_id>')
class MenuReviewRoute(Resource):
    @review.expect(MODEL_menu_review)
    @review.doc(description='Adding new menu_item review on an item')
    def post(self, menu_item_id):
        schema = MenuReviewSchema()
        try:
            # Setting up the menu review request data
            menu_review = schema.load(request.data)
            menu_review['_id'] = str(ObjectId())
            menu_review['menu_item_id'] = menu_item_id
            menu_review['date_time'] = datetime.now()

            # Insert review into database
            menu_db.update(
                {'menu_items._id': menu_item_id},
                {'$push': {'menu_items.$.review_list': schema.dump(menu_review)}}
            )
            menu_review_db.insert_one(schema.dump(menu_review))

            # Update average rating of the menu item
            review_list = list(menu_review_db.find({'menu_item_id': menu_item_id}))
            total_rating = 0
            for x in range(len(review_list)):
                total_rating += review_list[x]['rating']
            avg_rating = total_rating / len(review_list)

            menu_db.update_one(
                {'menu_items._id': menu_item_id},
                {'$set': {'menu_items.$.rating': round(avg_rating, 2)}}
            )
            return{
                'inserted': schema.dump(menu_review)
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return{
                'result': 'Missing required fields'
            },status.HTTP_400_BAD_REQUEST
    

    @review.doc(description="Delete a review of a menu item")        
    @review.expect(MODEL_menu_review_id)
    def delete(self, menu_item_id):
        id = request.data['_id']
        menu_db.update(
            {'menu_items._id': menu_item_id},
            {'$pull':{'menu_items.$.review_list':{'_id': id}}}
        )
        menu_review_db.delete_one({'_id': id})
        return {
            'deleted':'success'
        }, status.HTTP_200_OK

@review.route('/zomato')
class RestaurantReviewsRoute(Resource):
    @review.doc(description='Get Latest 5 Reviews for the Restaurant')
    def get(self):
        # Fetch from Zomato API
        response = requests.get(
            url=zomato_config['url'] + '/reviews', 
            params=zomato_config['params'], 
            headers=zomato_config['headers']
        )

        if response.status_code == status.HTTP_200_OK:
            return response.json()['user_reviews'], status.HTTP_200_OK

        return {
            'error': 'Invalid Restaurant ID'
        }, status.HTTP_400_BAD_REQUEST