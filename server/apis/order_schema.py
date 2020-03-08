from marshmallow import Schema, fields, post_load


class OrderItemSchema(Schema):
    menu_item_id = fields.String(required=True)
    amount = fields.Float(required=True)
    notes = fields.String()
    order_id = fields.String()


class OrderSchema(Schema):
    orderItems_id= fields.List(fields.String())
    table_id = fields.String(required=True)
    status = fields.Boolean()

    