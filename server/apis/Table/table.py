from db import db_client
from flask import request, jsonify
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from bson.objectid import ObjectId
import json
from apis.Table.table_schema import TableSchema
from marshmallow import ValidationError
from functools import wraps

table = Namespace('table', description='Table Backend Service')
table_db = db_client.table

MODEL_table = table.model('Table', {
    'name' : fields.String(),
    'seat' : fields.Integer(),
})


'''
*******************************************************************
Table Backend Service

API endpoints relating to tables and table management (e.g. calling
waiter).
*******************************************************************
'''


@table.doc(description='Endpoint for whole Table Operations')
@table.route('')
class Table(Resource):
    @table.doc(description='Get all tables on the database')
    def get(self):
        tables = list(table_db.find({}))
        for table in tables:
            table['_id'] = str(table['_id'])
        return tables, status.HTTP_200_OK


    @table.doc(description='Adding new table')
    @table.expect(MODEL_table)
    def post(self):
        schema = TableSchema()
        try:
            table = schema.load(request.data)
            operation = table_db.insert_one(schema.dump(table))
            return { 
                'inserted': str(operation.inserted_id),
                'result': 'New table has been created'
            }, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return { 
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST


@table.route('/<string:table_id>')
class TableSpecificRoute(Resource):
    @table.doc(description='Get details of a table')
    def get(self, table_id):
        table = table_db.find_one({'_id': ObjectId(table_id)})

        if table is None:
            return status.HTTP_404_NOT_FOUND
        
        table['_id'] = str(table['_id'])
        return table


    @table.doc(description='Updating a table\'s details')
    @table.expect(MODEL_table)
    def put(self, table_id):
        schema = TableSchema()
        updated_table = schema.load(request.data)

        table_db.replace_one(
            {'_id': ObjectId(table_id)},
            schema.dump(updated_table)
        )

        return {
            'updated': table_id
        }, status.HTTP_200_OK
            

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


@table.route('/waiter/<string:table_id>')
class CallWaiterRoute(Resource):
    @table.doc(description='Toggle Calling Waiter Status of Table')
    def patch(self, table_id):
        table = table_db.find_one({'_id': ObjectId(table_id)})
        current_status = table['calling_waiter']

        table_db.update_one(
            {'_id': ObjectId(table_id)},
            {'$set': {'calling_waiter': not current_status}}
        )

        return {
            'result': table_id + ' Calling Waiter: ' + str(not current_status)
        }, status.HTTP_200_OK
