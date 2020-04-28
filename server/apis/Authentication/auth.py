from db import db_client
from flask import request, jsonify
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from bson.objectid import ObjectId
import json
from apis.Authentication.auth_schema import Auth, AuthSchema, UserSchema
from apis.Session.session_schema import SessionSchema
from apis.Table.table_schema import TableSchema
from marshmallow import ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime


'''
*******************************************************************
Authorisation and User Backend Service

API endpoints relating to user information and authentication. 
Handles sign in, registation and logout. Also contains endpoints to
obtain user details and past orders.
*******************************************************************
'''

auth_db = db_client.auth
table_db = db_client.table
session_db = db_client.session
auth = Namespace('auth', description='Authentication Backend Service')

MODEL_auth = auth.model('Auth', {
    'id' : fields.String(),
    'name' : fields.String(),
    'email' : fields.String(),
    'password' : fields.String(),
    'admin' : fields.Boolean()
})

MODEL_auth_signup = auth.model('Auth Signup', {
    'name' : fields.String(),
    'email' : fields.String(),
    'password' : fields.String()
})

MODEL_auth_login = auth.model('Auth Login', {
    'email' : fields.String(),
    'password' : fields.String()
})

MODEL_auth_logout = auth.model('Auth Logout',{
    'session_id' : fields.String()
} )     

# For debugging only
@auth.doc(description='Endpoint for whole Auth Operations')
@auth.route('')
class Authorisation(Resource):
    @auth.doc(description='Get all users on the database')
    def get(self):
        auths = list(auth_db.find({}))
        for auth in auths:
            auth['_id'] = str(auth['_id'])
        return auths, status.HTTP_200_OK

# Signup Endpoints
@auth.route('/signup')
class SignupRoute(Resource):
    @auth.doc(description='Signing new user')
    @auth.expect(MODEL_auth_signup)
    def post(self):
        schema = AuthSchema()
        try:
            auth = schema.load(request.data)
            if auth.email == '' or auth.password == '' or auth.name == '':
                return { 
                    'result': 'Missing required fields'
                }, status.HTTP_400_BAD_REQUEST
            test = auth_db.find_one({'email': auth.email})
            if test:
                return { 
                    'result': 'User with that email already exist'
                }, status.HTTP_400_BAD_REQUEST 
            operation = auth_db.insert_one(schema.dump(auth))
            return { 'result': 'new user has been created'}, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return { 
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST   

# Login Endpoint
@auth.route('/login')
class LoginRoute(Resource):  
    @auth.doc(description='Login user')
    @auth.expect(MODEL_auth_login)
    def post(self): 
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return { 'result': 'Could not verify'}, 401 
        # Gets the user
        auth = auth_db.find_one({'email': email})

        if not auth:
            return { 'result': 'Could not verify'}, 401 

        if check_password_hash(auth['password'], password):
            # generate token for now just use user id
            token = str(auth['_id'])

            return {
                'token': token,
                'email': auth['email'],
                'admin': auth['admin'],
            }, status.HTTP_200_OK

        return {'result': 'Could not verify'}, 401

# Login Admin Endpoint
@auth.route('/loginAdmin')
class LoginAdminRoute(Resource):  
    @auth.doc(description='Login admin')
    @auth.expect(MODEL_auth_login)
    def post(self): 
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return { 'result': 'Could not verify'}, 401 
        # Gets the user
        auth = auth_db.find_one({'email': email})

        if not auth:
            return { 'result': 'Could not verify'}, 401 

        if auth['admin'] != True:
            return { 'result': 'You do not have access.'}, 401 

        if check_password_hash(auth['password'], password):
            # generate token for now just use user id
            token = str(auth['_id'])

            return {
                'token': token,
                'email': auth['email'],
                'admin': auth['admin'],
            }, status.HTTP_200_OK

        return {'result': 'Could not verify'}, 401          

@auth.route('/user/<string:user_id>')
class UserRoute(Resource):
    @auth.doc(description='Get User Details')
    def get(self, user_id):
        if user_id == 'Guest':
            return status.HTTP_204_NO_CONTENT

        schema = UserSchema()
        user = auth_db.find_one({ '_id': ObjectId(user_id) })

        if user is None:
            return {
                'result': 'Did not find user with id ' + user_id
            }, status.HTTP_200_OK

        return schema.dump(user), status.HTTP_200_OK

@auth.route('/user/<string:user_id>/past-orders')
class UserOrdersRoute(Resource):
    @auth.doc(description='Get User\'s Past Orders')
    def get(self, user_id):
        if user_id == 'Guest':
            return status.HTTP_204_NO_CONTENT

        orders = []
        for session in session_db.find({'user_id': user_id}):
            for order in session['order_list']:
                if order['status'] == 'Completed':
                    orders.append(order)

        return sorted(orders, key=lambda k: k['timestamp'], reverse=True), status.HTTP_200_OK


@auth.route('/logout')
class Logout(Resource):
    @auth.doc(description='Logout user')
    @auth.expect(MODEL_auth_logout)
    def patch(self):
        id = request.data.get('session_id')
        if id is None:
            return status.HTTP_400_BAD_REQUEST

        try:
            session_db.find_one_and_update(
                {'_id': ObjectId(id)},
                {'$set':
                    {'active': False}
                }
            )
            return {'updated': id}, status.HTTP_200_OK
        except ValidationError as err:
            print(err)
            return{
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST
