from marshmallow import Schema, fields, post_load


class ComposableDict(fields.Dict):
    def __init__(self, inner):
        self.inner = inner

    def _serialize(self, value, attr, obj):
        return{
            key:self.inner._serialize(val,key, value)
            for key, val in value.items()
        }
class OrderItem:
    def __init__(self, menu_item_id, amount, notes):
        self.menu_item_id = menu_item_id
        self.amount = amount
        self.notes = notes

class OrderItemSchema(Schema):
    menu_item_id = fields.String(required=True)
    amount = fields.Float(required=True)
    notes = fields.String()
    status = fields.Boolean()
    order_id = fields.String()

# class Order:
#     def __init__(self, timestamp):
#         self.timestamp = timestamp

class OrderSchema(Schema):
    orderItems_id= fields.List(fields.String())
    table_id = fields.String(required=True)

    