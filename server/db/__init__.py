from pymongo import MongoClient

# Setup for the Database
db_conn = 'mongodb+srv://sebchua:test1234@meja-menu-cluster-r4wmp.mongodb.net/test?retryWrites=true&w=majority'
db_client = MongoClient(db_conn).database