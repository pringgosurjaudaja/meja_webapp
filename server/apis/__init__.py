from flask_restplus import Api

from .menu import api as menu_service
# from .auth import api as auth_service
# from .order import api as order_service

api = Api(
    title= 'Meja Backend Service',
    description= 'Backend server for Meja App'
)

api.add_namespace(menu_service)
# api.add_namespace(auth_service)
# api.add_namespace(order_service)
