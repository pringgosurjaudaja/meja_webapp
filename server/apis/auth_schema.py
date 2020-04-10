from marshmallow import Schema, fields, post_load
from werkzeug.security import generate_password_hash, check_password_hash

class Auth:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = generate_password_hash(password, method='sha256')
        self.admin = False
    
class AuthSchema(Schema):
    name = fields.String(required=True)
    email = fields.String(required=True)
    password = fields.String(required=True)
    admin = fields.Boolean()

    @post_load
    def create_auth(self, data, **kwargs):
        return Auth(**data)

class UserSchema(Schema):
    name = fields.String()
    email = fields.String()

    class Meta:
        ordered = True