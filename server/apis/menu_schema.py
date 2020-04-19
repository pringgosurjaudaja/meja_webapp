from marshmallow import Schema, fields, EXCLUDE, validate

class MenuReviewSchema(Schema):
    _id = fields.String()
    menu_item_id = fields.String()
    rating = fields.Integer(validate=validate.Range(min=0, max=5))
    comment = fields.String(missing=[])
    user = fields.String()
    date_time = fields.DateTime(format= '%d-%m-%YT%H:%M:%S')

class MenuItemSchema(Schema):
    _id = fields.String()
    name = fields.String(required=True)
    description = fields.String(required=True)
    media_urls = fields.String()       # URLs for pictures of the menu item
    price = fields.Float(required=True)
    chefs_pick = fields.Boolean(missing=False)      # Whether it is part of the chef's recommended list
    review_list = fields.List(fields.Nested(MenuReviewSchema), missing=[])
    rating = fields.Float(missing = 0)
    
    class Meta:
        ordered = True
        unknown = EXCLUDE

class MenuCategorySchema(Schema):
    _id = fields.String()
    name = fields.String(required=True)
    menu_items = fields.List(fields.Nested(MenuItemSchema), missing=[])

    class Meta:
        ordered = True

