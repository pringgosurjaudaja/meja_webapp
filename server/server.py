from flask import Flask
from apis import api
from pymongo import MongoClient

# Setup for the Flask App
app = Flask(__name__)

# Setup for the Database
db = MongoClient().database


if __name__ == '__main__':
    # client = MongoClient()
    # menu = client.menu
    # mains = menu.mains
    # menu_item = {"name": "Taiwanese Pork Belly", "price": 15}
    # mains.insert_one(menu_item)
    # print(client)

    api.init_app(app)
    app.run(debug=True)
