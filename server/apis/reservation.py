from flask import request
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from marshmallow import ValidationError
from bson.objectid import ObjectId
from db import db_client
from apis.reservation_schema import ReservationSchema

reservation = Namespace('reservation', description="Reservation Backend Service")
reservation_db = db_client.reservation
table_db = db_client.table

MODEL_reservation = reservation.model('Reservation',{
    'email': fields.String(),
    'datetime': fields.DateTime(),
    'number_diner': fields.Integer(),
    'reservation_notes': fields.String()
})

MODEL_reservation_status = reservation.model('Reservation Status',{
    'status': fields.String()
})

MODEL_reservation_search = reservation.model('Reservation Search',{
    'date': fields.DateTime(),
    'number_diner': fields.Integer()
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
            date = res['datetime'].date()
            time = res['datetime'].time()
            res['status'] = "In-Progress"
            # Logic to allocate table
            tables = list(table_db.find({'seat': res['number_diner']}))
            for table in tables:
                reservations = list(reservation_db.find({'datetime': '%sT%s'%(date,time), 'number_diner': res['number_diner'], 'table_number': table['number']}))
                print(res['datetime'])
                print(res['number_diner'])
                print(table['number'])
                print(reservations)
                if not reservations:
                    res['table_number'] = table['number']
                    break

            operation = reservation_db.insert_one(schema.dump(res))
            return { 'result': 'new reservation has been created'}, status.HTTP_201_CREATED
        except ValidationError as err:
            print(err)
            return { 
                'result': 'Missing required fields'
            }, status.HTTP_400_BAD_REQUEST     

@reservation.route('/availability')
class ReservationSearch(Resource):     
    @reservation.doc(description='Available Time')
    @reservation.expect(MODEL_reservation_search)
    def post(self):
        try:
            date = request.data.get('date')
            diner = request.data.get('number_diner')
            tables = list(table_db.find({'seat': diner}))
            times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
            res = []
            for time in times:
                reservations = list(reservation_db.find({'datetime': '%sT%s:00'%(date,time), 'number_diner': diner}))
                if len(reservations) < len(tables):
                    res.append(time)
            return res
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

    @reservation.doc(description='Cancelling/Deleting a Reservation')
    def delete(self, reservation_id):
        try:
            reservation_db.delete_one({"_id" : ObjectId(reservation_id)})
            return { 'result': 'reservation has been cancelled'}, status.HTTP_200_OK
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