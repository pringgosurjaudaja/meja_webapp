from flask import request
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from marshmallow import ValidationError
from bson.objectid import ObjectId
from db import db_client
from apis.reservation_schema import ReservationSchema

reservation = Namespace('reservation', description="Reservation Backend Service")
reservation_db = db_client.reservation

MODEL_reservation = reservation.model('Reservation',{
    'table_id': fields.String(),
    'email': fields.String(),
    'datetime': fields.DateTime(),
    'number_diner': fields.Integer(),
    'reservation_notes': fields.String()
})

MODEL_reservation_status = reservation.model('Reservation Status',{
    'status': fields.String()
})

@reservation.route('')
class Reservation(Resource):
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
            return reservations, status.HTTP_200_OK

    @reservation.doc(description='Create New Reservation')
    @reservation.expect(MODEL_reservation)
    def post(self):
        schema = ReservationSchema()
        try:
            res = schema.load(request.data)
            # print(res['datetime'].date())
            # print(res['datetime'].time())
            res['status'] = "In-Progress"
            operation = reservation_db.insert_one(schema.dump(res))
            return { 'result': 'new reservation has been created'}, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return { 
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST     

@reservation.route('/<string:reservation_id>')
class ReservationRoute(Resource):
    @reservation.doc(description='Edit Reservation Status')
    @reservation.expect(MODEL_reservation_status)
    def patch(self, reservation_id):
        try:
            new_status = request.data.get('status')
            reservation_db.find_one_and_update(
                {'_id': ObjectId(reservation_id)},
                {'$set':
                    {'status': new_status}
                 }
            )
            return {'updated': reservation_id}, status.HTTP_200_OK
        except ValidationError as err:
            print(err)
            return {
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST       

             

# @reservation.route('/<string:reservation_id>')
# class ReservationRoute(Resource):
#     @reservation.doc(description="Get reservation based on id")
#     def get(self, reservation_id):
#         reservation = reservation_db.find_one(
#             {'_id': ObjectId(reservation_id)}
#         )
#         if not reservation:
#             reservation['_id'] = str(reservation['_id'])
#             return reservation, status.HTTP_200_OK
#         else:

#             return {
#                             'result': 'No reservation'
#                         } 