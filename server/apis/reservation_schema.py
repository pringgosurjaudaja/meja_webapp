from marshmallow import Schema, fields

class ReservationSchema(Schema):
    table_id= fields.String()
    email= fields.String()
    start_time= fields.DateTime(required=True)
    reservation_notes= fields.String()