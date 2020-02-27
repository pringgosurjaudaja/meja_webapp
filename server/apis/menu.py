from flask_restplus import Namespace, Resource, fields

api = Namespace('menu', description='Menu Service')

@api.route('/')
class MenuItems(Resource):
    def get(self):
        return 'Hello World'