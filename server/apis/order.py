from db import db_client
from flask import request, jsonify
from flask_api import status
from flask_restplus import Namespace, Resource, fields, marshal_with, reqparse
from bson.objectid import ObjectId
import json
from marshmallow import ValidationError

order = Namespace('order', description='Order Backend Service')
order_db = db_client.order