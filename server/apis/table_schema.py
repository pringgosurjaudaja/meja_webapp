from marshmallow import Schema, fields

class TableSchema(Schema):
    _id = fields.String()
    name = fields.String(required=True)
    seat = fields.Integer(required=True)

    class Meta:
        ordered = True