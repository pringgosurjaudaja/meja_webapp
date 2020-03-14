from db import db_client
from flask import request, jsonify
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from apis.table_schema import TableSchema
from marshmallow import ValidationError
from functools import wraps

table = Namespace('table', description='Table Backend Service')
parser = reqparse.RequestParser()
table_db = db_client.table

MODEL_table = table.model('Table', {
    'number' : fields.Integer(),
    'seat' : fields.Integer(),
})

@table.doc(description='Endpoint for whole Table Operations')
@table.route('')
class Table(Resource):
    @table.doc(description='Get all tables on the database')
    def get(self):
        tables = list(table_db.find({}))
        for table in tables:
            table['_id'] = str(table['_id'])
        return tables, status.HTTP_200_OK

# Add Table Endpoints
@table.route('/add')
class AddRoute(Resource):
    @table.doc(description='Adding new table')
    @table.expect(MODEL_table)
    def post(self):
        schema = TableSchema()
        try:
            table = schema.load(request.data)
            operation = table_db.insert_one(schema.dump(table))
            return { 'result': 'new table has been created'}, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return { 
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST  

@table.route('/delete/<string:table_id>')      
class DeleteRoute(Resource):
    @table.doc(description='Deleting a Table')
    def delete(self, table_id):
        try:
            table_db.delete_one({"_id" : ObjectId(table_id)})
            return { 'result': 'table has been deleted'}, status.HTTP_200_OK
        except ValidationError as err:
            print(err)
            return { 
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST         
