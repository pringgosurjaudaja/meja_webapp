from flask_restplus import Api
from apis.menu import menu 
from apis.auth import auth, authorizations
# from .auth import api as auth_service
# from .order import api as order_service

api = Api(
    title= 'Meja Backend Service',
    description= 'Backend server for Meja App',
    authorizations= authorizations
)

api.add_namespace(menu)
api.add_namespace(auth)
