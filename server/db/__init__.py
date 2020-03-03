from pymongo import MongoClient

# Setup for the Database
db_conn = 'mongodb+srv://admin:Artemis123@project-meja-y8ndi.mongodb.net/test?retryWrites=true&w=majority'
db_client = MongoClient(db_conn).database
