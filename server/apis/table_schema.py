from marshmallow import Schema, fields

class TableSchema(Schema):
    number = fields.Integer(required=True)
    seat = fields.Integer(required=True)

    class Meta:
        ordered = True