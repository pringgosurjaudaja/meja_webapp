from flask_restplus import Api
from apis.Menu.menu import menu 
from apis.Session.session import session
from apis.Table.table import table 
from apis.Reservation.reservation import reservation
from apis.Authentication.auth import auth
from apis.Review.review import review

api = Api(
    title= 'Meja Backend Service',
    description= 'Backend server for Meja App',
)

api.add_namespace(menu)
api.add_namespace(session)
api.add_namespace(auth)
api.add_namespace(table)
api.add_namespace(reservation)
api.add_namespace(review)
