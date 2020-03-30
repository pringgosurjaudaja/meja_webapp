from marshmallow import Schema, fields
from apis.menu_schema import MenuItemSchema
import datetime as dt

class OrderItemSchema(Schema):
    menu_item = fields.Nested(MenuItemSchema, required=True)
    quantity = fields.Integer(required=True)
    notes = fields.String(missing='')

class OrderSchema(Schema):
    session_id = fields.String(required=True)
    table_id = fields.String(required=True)
    status = fields.String(required=True)
    timestamp = fields.DateTime(default=dt.datetime.now())
    order_items = fields.List(fields.Nested(OrderItemSchema), missing=[])
