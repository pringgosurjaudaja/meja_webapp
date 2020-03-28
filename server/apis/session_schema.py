from marshmallow import Schema, fields
from apis.order_schema import OrderSchema

class SessionSchema(Schema):
    table_id = fields.String()
    timestamp = fields.DateTime(format= '%d-%m-%YT%H:%M:%S')
    user_id = fields.String()
    order_list = fields.List(fields.Nested(OrderSchema), missing = [])