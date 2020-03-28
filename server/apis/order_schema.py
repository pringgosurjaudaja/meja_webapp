from marshmallow import Schema, fields, post_load
from apis.menu_schema import MenuItemSchema

class OrderItemSchema(Schema):
    menu_item = fields.Nested(MenuItemSchema, required=True)
    quantity = fields.Integer(required=True)
    notes: fields.String(missing='')

class OrderSchema(Schema):
    table_id = fields.String(required=True)
    status = fields.String(required=True)
    order_items= fields.List(fields.Nested(OrderItemSchema), missing=[])

class SessionSchema(Schema):
    table_id = fields.String()
    user = fields.String()
    orderList = fields.List(fields.Nested(OrderSchema), missing = [])
    datetime_visit = fields.DateTime(format= '%d-%m-%YT%H:%M:%S')