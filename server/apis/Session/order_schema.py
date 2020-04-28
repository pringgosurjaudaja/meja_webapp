from marshmallow import Schema, fields
from apis.Menu.menu_schema import MenuItemSchema
import datetime as dt

class OrderItemSchema(Schema):
    _id = fields.String() 
    menu_item = fields.Nested(MenuItemSchema, required=True)
    quantity = fields.Integer(required=True)
    notes = fields.String(missing='')

    class Meta:
        ordered = True

class OrderSchema(Schema):
    _id = fields.String()
    status = fields.String(required=True)
    timestamp = fields.DateTime(default=dt.datetime.now())
    order_items = fields.List(fields.Nested(OrderItemSchema), missing=[])

    class Meta:
        ordered = True
