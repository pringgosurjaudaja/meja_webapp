from flask_restplus import Api
from apis.menu import menu 
from apis.session import session
from apis.table import table 
from apis.reservation import reservation
from apis.auth import auth
from apis.review import review

authorizations = {
    'apikey' : {
        'type' : 'apiKey',
        'in' : 'header',
        'name' : 'X-API-KEY'
    }
}

api = Api(
    title= 'Meja Backend Service',
    description= 'Backend server for Meja App',
    authorizations= authorizations
)

api.add_namespace(menu)
api.add_namespace(session)
api.add_namespace(auth)
api.add_namespace(table)
api.add_namespace(reservation)
api.add_namespace(review)
