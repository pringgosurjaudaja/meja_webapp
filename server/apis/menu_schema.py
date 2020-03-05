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
    media_urls = fields.List(fields.String())       # URLs for pictures of the menu item
    price = fields.Float(required=True)
    labels = fields.List(fields.Integer())          # Vegan, Vegetarian, Gluten-Free
    category_tags = fields.List(fields.String())    # E.g. Indian, Spicy, Mains, etc.
    chefs_pick = fields.Boolean(default=False)      # Whether it is part of the chef's recommended list

    @post_load
    def make_menu_item(self, data, **kwargs):
        return MenuItem(**data)