from marshmallow import Schema, fields
from apis.Session.order_schema import OrderSchema
import datetime as dt

class SessionSchema(Schema):
    _id = fields.String()
    table_id = fields.String(required=True)
    user_id = fields.String(required=True)
    active = fields.Boolean(missing=True)
    timestamp = fields.DateTime(format= '%d-%m-%YT%H:%M:%S', default=dt.datetime.now())
    order_list = fields.List(fields.Nested(OrderSchema), missing=[])

    class Meta:
        ordered = True