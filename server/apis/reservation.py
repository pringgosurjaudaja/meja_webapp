from flask import request
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from marshmallow import ValidationError
from bson.objectid import ObjectId
from db import db_client
from apis.reservation_schema import ReservationSchema

reservation_db = db_client.reservation
reservation = Namespace('reservation', description="Reservation Backend Service")
MODEL_reservation = reservation.model('Reservation',{
    'start_time': fields.DateTime(),
    'reservation_notes': fields.String(),
    'email': fields.String()
})

@reservation.route('')
class ReservationAll(Resource):
    @reservation.doc(description='Get all reservation in db')
    def get(self):
        reservations = list(reservation_db.find({}))
        if not reservations:
            return {
                'result': 'No Reservation'
            }
        else:
            for reservation in reservations:
                reservation['_id'] = str(reservation['_id'])
            return reservation, status.HTTP_200_OK

    @reservation.doc(description='Create New Reservation')
    @reservation.expect(MODEL_reservation)
    def post(self):
        schema = ReservationSchema()
        print("TESTING")
        reservation_inserted = schema.load(request.data)
        reservation_inserted['table_id'] = 1
        print(reservation_inserted)
        start = request.data.get('start_time')
        query = reservation_db.find_one({'start_time': start})

        if not query:
            added = reservation_db.insert_one(schema.dump(reservation))
            return{'inserted': str(added.inserted_id)}, status.HTTP_201_CREATED
        else:
            return{
                'result': 'Reservation not available'
            }

@reservation.route('/<string:reservation_id>')
class ReservationRoute(Resource):
    @reservation.doc(description="Get reservation based on id")
    def get(self, reservation_id):
        reservation = reservation_db.find_one(
            {'_id': ObjectId(reservation_id)}
        )
        if not reservation:
            reservation['_id'] = str(reservation['_id'])
            return reservation, status.HTTP_200_OK
        else:
            
            return {
                            'result': 'No reservation'
                        }