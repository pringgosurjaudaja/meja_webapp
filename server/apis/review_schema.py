from marshmallow import Schema, fields, validate

class ReviewReply(Schema):
    reply = fields.String()
    user = fields.String()
    date_time = fields.DateTime(format ='%d-%m-%YT%H:%M:%S')
class ReviewSchema(Schema):
    review = fields.String()
    user = fields.String()
    date_time = fields.DateTime(format= '%d-%m-%YT%H:%M:%S')
    rating = fields.Integer(validate=validate.Range(min=0, max=5))
    replies = fields.List(fields.Nested(ReviewReply), missing=[])

