from flask import request, render_template
from flask_api import status
from flask_restplus import Namespace, Resource, fields
from marshmallow import ValidationError
from bson.objectid import ObjectId
from db import db_client
from apis.reservation_schema import ReservationSchema
from datetime import datetime, date
from helpers.email_sender import EmailSender

reservation = Namespace('reservation', description="Reservation Backend Service")
reservation_db = db_client.reservation
table_db = db_client.table

MODEL_reservation = reservation.model('Reservation',{
    'email': fields.String(),
    'datetime': fields.DateTime(),
    'number_diner': fields.Integer(),
    'reservation_notes': fields.String()
})

MODEL_reservation_update = reservation.model('Reservation Update',{
    'table_id': fields.String(),
    'email': fields.String(),
    'datetime': fields.DateTime(),
    'number_diner': fields.Integer(),
    'reservation_notes': fields.String()
})

MODEL_reservation_search = reservation.model('Reservation Search',{
    'date': fields.DateTime(),
    'number_diner': fields.Integer()
})

MODEL_reservation_email = reservation.model('Reservation email',{
    'reservation_id': fields.String()
})

@reservation.route('')
class Reservation(Resource):
    @reservation.doc(description='Get all reservation in db')
    def get(self):
        reservations = list(reservation_db.find({}))
        result = []
        if not reservations:
            return {
                'result': 'No Reservation'
            }
        else:
            for reservation in reservations:
                reservation['_id'] = str(reservation['_id'])
                datetime_res = datetime.strptime(reservation['datetime'], "%Y-%m-%dT%H:%M:%S")
                if (datetime_res.date() >= date.today()):
                    result.append(reservation)
            return result, status.HTTP_200_OK

    @reservation.doc(description='Create New Reservation')
    @reservation.expect(MODEL_reservation)
    def post(self):
        schema = ReservationSchema()
        try:
            res = schema.load(request.data)
            date = res['datetime'].date()
            time = res['datetime'].time()

            # Try to allocate reservation to a table
            tables = list(table_db.find({'seat': { '$gte': res['number_diner']} }))
            tables.sort(key=lambda table: table['seat'], reverse=False)
            res['table_id'] = None
            for table in tables:
                reservation = list(reservation_db.find({
                    'datetime': '%sT%s'%(date,time), 
                    'table_id': str(table['_id'])
                }))

                if not reservation:
                    res['table_id'] = str(table['_id'])
                    break
            
            if not res['table_id']:
                return {
                    'message' : 'Cannot allocate table.'
                }, status.HTTP_404_NOT_FOUND

            operation = reservation_db.insert_one(schema.dump(res))
            return {
                'inserted': str(operation.inserted_id),
                'result': 'New reservation has been created'
            }, status.HTTP_201_CREATED
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
            tables = list(table_db.find({'seat': { '$gte': diner} }))
            times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
            res = []
            for time in times:
                reservations = list(reservation_db.find({'datetime': '%sT%s:00'%(date,time), 'number_diner': {'$gte': diner} }))
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
    @reservation.doc(description='Edit Reservation')
    @reservation.expect(MODEL_reservation_update)
    def put(self, reservation_id):
        try:
            reservation_db.find_one_and_update(
                {'_id': ObjectId(reservation_id)},
                {'$set':
                    {'table_id': request.data.get('table_id'),
                     'email': request.data.get('email'),
                     'datetime': request.data.get('datetime'),
                     'number_diner': request.data.get('number_diner'),
                     'reservation_notes': request.data.get('reservation_notes')
                    }
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

@reservation.route('/table/<string:table_id>')
class ReservationTableRoute(Resource):
    @reservation.doc(description='Get all reservations for a specific table')
    def get(self, table_id):
        reservations = []

        for reservation in reservation_db.find({'table_id': table_id}):
            reservation['_id'] = str(reservation['_id'])
            reservations.append(reservation)

        reservations.sort(key=lambda reservation:reservation['datetime'])
        return reservations, status.HTTP_200_OK

@reservation.route('/email')
class ReservationEmail(Resource):
    @reservation.expect(MODEL_reservation_email)
    def post(self):
        reservation = reservation_db.find_one({'_id': ObjectId(request.data['reservation_id'])})
        email_context ={
            'name': reservation['email'],
            'number_diner': reservation['number_diner'],
            'date_time': reservation['datetime'],
            'notes': reservation['reservation_notes']
        }
        email={
            'subject': f"Reservation Confirmation for {reservation['datetime']}",
            'text': f"Your reservation at {reservation['datetime']} for {reservation['number_diner']} people are confirmed.",
            'html': render_template('reservation_confirmation.html', context=email_context)
        }
        EmailSender().send_email(reservation['email'],email)
        return {
            'result': 'Email sent to ' + 'artemisproj' + ' successfully'
        }, status.HTTP_200_OK