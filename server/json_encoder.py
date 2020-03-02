from bson import ObjectId
from json import JSONEncoder
import datetime

# Used to handle JSON serialising for ObjectId from MongoDB Documents
class MongoJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId) or isinstance(o, datetime.datetime):
            return str(o)
        return JSONEncoder.default(self, o)