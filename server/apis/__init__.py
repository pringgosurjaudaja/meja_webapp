from flask_restplus import Api
from apis.menu import menu 
from apis.session import session
from apis.table import table 
from apis.about import about
from apis.reservation import reservation
from apis.auth import auth, authorizations
from apis.review import review

api = Api(
    title= 'Meja Backend Service',
    description= 'Backend server for Meja App',
    authorizations= authorizations
)

api.add_namespace(menu)
api.add_namespace(session)
api.add_namespace(about)
api.add_namespace(auth)
api.add_namespace(table)
api.add_namespace(reservation)
api.add_namespace(review)
