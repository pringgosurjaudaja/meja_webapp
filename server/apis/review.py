from db import db_client
from flask import request, jsonify, render_template
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from marshmallow import ValidationError
from apis.review_schema import ReviewSchema
from datetime import datetime

review = Namespace('review', description='Review Backend Service')
review_db = db_client.review


MODEL_review = review.model('Review', {
    'review': fields.String(),
    'rating': fields.Integer(),
    'user': fields.String()  
})

@review.route('')
class Review(Resource):
    @review.doc(description='Get all review')
    def get(self):
        reviews = list(review_db.find({}))
        for review in reviews:
            review['_id'] = str(review['_id'])
        return reviews, status.HTTP_200_OK
    @review.expect(MODEL_review)
    @review.doc(description='Create new Review')
    def post(self):
        schema = ReviewSchema()
        try:
            review = schema.load(request.data)
            now = datetime.now()
            review['date_time'] = now
            print(review)
            operation = review_db.insert_one(schema.dump(review))
            return{ 'result': str(operation.inserted_id)}, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return{
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST

@review.route('/<string:review_id>')
class ReviewDelete(Resource):
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