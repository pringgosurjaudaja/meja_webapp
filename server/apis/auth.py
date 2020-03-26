from db import db_client
from flask import request, jsonify
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from apis.auth_schema import Auth, AuthSchema
from apis.order_schema import SessionSchema
from apis.table_schema import TableSchema
from marshmallow import ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime

auth = Namespace('auth', description='Authentication Backend Service')
parser = reqparse.RequestParser()
auth_db = db_client.auth
table_db = db_client.table
session_db = db_client.session
authorizations = {
    'apikey' : {
        'type' : 'apiKey',
        'in' : 'header',
        'name' : 'X-API-KEY'
    }
}

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

def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token = None

        if 'X-API-KEY' in request.headers:
            token = request.headers['X-API-KEY']

        if not token:
            return {'message' : 'Token is missing.'}, 401

        print('TOKEN: {}'.format(token))  
        return f(*args, **kwargs)

    return decorated      

# For debugging only
@auth.doc(description='Endpoint for whole Auth Operations')
@auth.route('')
class Auth(Resource):
    @auth.doc(security='apikey')
    @token_required
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
            return {'token': token,
                'email': auth['email'],
                'admin': auth['admin']}, status.HTTP_200_OK

        return {'result': 'Could not verify'}, 401  

# Logout Endpoint?
