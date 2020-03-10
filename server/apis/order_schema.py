from marshmallow import Schema, fields, post_load
from apis.menu_schema import MenuItemSchema

class OrderItemSchema(Schema):
    menu_item_id = fields.String(required=True)
    menu_item_name = fields.String()
    menu_item_price = fields.Float()
    amount = fields.Float(required=True)
    notes = fields.String()
    order_id = fields.String()
    menu_item_id = fields.String()


class OrderSchema(Schema):
    orderItems= fields.List(fields.Nested(OrderItemSchema), missing=[])
    table_id = fields.String(required=True)
    status = fields.String()

    