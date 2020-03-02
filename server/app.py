from flask_api import FlaskAPI
from flask_restplus import Api, Resource, fields, marshal_with, reqparse
from apis import api
from json_encoder import MongoJSONEncoder

if __name__ == '__main__':
    # Setup for the Flask App
    app = FlaskAPI(__name__)
    app.json_encoder = MongoJSONEncoder
    api.init_app(app)
    app.run(debug=True)
