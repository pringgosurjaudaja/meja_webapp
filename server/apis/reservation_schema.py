from marshmallow import Schema, fields

class ReservationSchema(Schema):
    table_id = fields.String()
    email = fields.String(required=True)
    datetime = fields.DateTime(required=True)
    number_diner = fields.Integer(required=True)
    reservation_notes = fields.String() 

    class Meta:
        ordered = True
