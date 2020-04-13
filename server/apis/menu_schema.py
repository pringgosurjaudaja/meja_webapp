from marshmallow import Schema, fields, EXCLUDE

class MenuItemSchema(Schema):
    _id = fields.String()
    name = fields.String(required=True)
    description = fields.String(required=True)
    media_urls = fields.List(fields.String(), missing=[])       # URLs for pictures of the menu item
    price = fields.Float(required=True)
    chefs_pick = fields.Boolean(missing=False)      # Whether it is part of the chef's recommended list

    class Meta:
        ordered = True
        unknown = EXCLUDE


class MenuCategorySchema(Schema):
    _id = fields.String()
    name = fields.String(required=True)
    menu_items = fields.List(fields.Nested(MenuItemSchema), missing=[])

    class Meta:
        ordered = True