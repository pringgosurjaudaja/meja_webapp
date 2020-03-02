from marshmallow import Schema, fields, post_load

class MenuItem:
    def __init__(self, name, description, media_urls, price, labels, tags):
        self.name = name
        self.description = description
        self.media_urls = media_urls
        self.price = price
        self.labels = labels
        self.tags = tags
    
class MenuItemSchema(Schema):
    name = fields.String(required=True)
    description = fields.String(required=True)
    media_urls = fields.List(fields.String())
    price = fields.Float(required=True)
    labels = fields.List(fields.Integer())
    tags = fields.List(fields.String())

    @post_load
    def make_menu_item(self, data, **kwargs):
        return MenuItem(**data)