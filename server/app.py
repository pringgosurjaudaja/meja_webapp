from flask_api import FlaskAPI
from flask_cors import CORS
from flask_socketio import SocketIO, Namespace, emit, send, join_room, leave_room
from apis import api
from flask import render_template, jsonify, request, make_response
import dialogflow_v2 as dialogflow
import requests
from bson import ObjectId
import json
from db import db_client
import os
from dotenv import load_dotenv
import re
load_dotenv()

menu_db = db_client.menu
review_db = db_client.review
session_db = db_client.session
table_db = db_client.table
import pprint
# from hooks.admin_hooks import AdminNamespace
# from hooks.customer_hooks import CustomerNamespace

app = FlaskAPI(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins='*')

ADMIN_ROOM = 'admins'

# region Customer Orders
@socketio.on('customer_order')
def on_customer_order(order):
    pprint.pprint(order)
    room = order['_id']
    join_room(room)
    print('Received customer order')
    # Inform order room that order has been received
    emit('orderReceived', order, room=room)
    emit('newCustomerOrder', order, room=ADMIN_ROOM)

@socketio.on('admin_join')
def on_admin_join():
    print('Admin Joined')
    join_room(ADMIN_ROOM)

@socketio.on('orderUpdated')
def handle_order_update(order):
    emit('updateOrders', order, room=order['_id'])
# endregion

# region Handle Calling Waiter
@socketio.on('call_waiter')
def on_call_waiter():
    print('In call waiter')
    # Inform admins to update their clients
    emit('customerCallingWaiter', room=ADMIN_ROOM)


# endregion




@app.route('/handle_chat', methods=['POST'])
def handle_chat():
    data = request.get_json(silent=True)
    print(data['queryResult']['parameters'])
    if 'menu_item' in data['queryResult']['parameters']:
        menu_item_raw = data['queryResult']['parameters']['menu_item']
        # menu_item = string.capwords(menu_item_raw)
        category = menu_db.find_one({'menu_items.name': re.compile(menu_item_raw, re.IGNORECASE)})
        print(category)
        menu_item_queried = menu_db.aggregate([
                {'$unwind': '$menu_items'},
                {'$match':{"menu_items.name": re.compile(menu_item_raw, re.IGNORECASE)}},
                
                {'$project': {
                            'name': '$menu_items.name',
                            'price': '$menu_items.price'
                }}
        ])
        item = menu_item_queried.next()
        # item_string = """
        #     Item name: {0},
        #     Price: ${1}
        # """.format(item['name'], item['price'])
        message = {
            "fulfillmentText": "Your text response",
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            f"Here is the detail of {item['name']}"
                        ]
                    }
                },
                {
                    "payload": {
                        
                        "richContent": [
                            [
                            {
                                "type": "image",
                                "rawUrl": "http://localhost:3000/static/media/test.17541ace.jpg",
                            },
                            {
                                "type": "info",
                                "title": item['name'],
                                "subtitle": f"Menu-category: {category['name']}\nPrice: {item['price']}",
                                
                            }
                            ]
                        ]
                        
                    }
                }
            ]
        }
        # reply = {
        #     'fulfillmentText': item_string,
        # }
        return jsonify(message)
        # print(reply)
        # return jsonify(reply)
    elif('menu_category' in data['queryResult']['parameters']):
        menu_category = data['queryResult']['parameters']['menu_category']
        category = menu_db.find_one({'name': re.compile(menu_category, re.IGNORECASE)})
        # menu_items = []
        text_message = f"Here are the list of {menu_category}"
        message1 = {
    "fulfillmentText": "Your text response",
    "fulfillmentMessages": [
        {
            "text": {
                "text": [
                    text_message
                ]
            }
        },
        {
            "payload": {

            }
        }
    ]
        }
        message = {
            "richContent": [
                [
                ]
            ]
            }
        for x in category['menu_items']:
            menu_item_rich = {
                "type": "list",
                "title": x['name'],
                "subtitle": f"Description: {x['description']}\nPrice: {x['price']}",
            }
            message['richContent'][0].append(menu_item_rich)
            message['richContent'][0].append({'type':'divider'})
            # menu_items.append(x['name'])
        print(message)
        message1['fulfillmentMessages'][1]['payload'] = message
        # category['_id'] = str(category['_id'])
        # reply = {
        #     'fulfillmentText': str(menu_items),
        # }
        return jsonify(message1)
    elif('menu_category_general' in data['queryResult']['parameters']):
        category = menu_db.find({})
        # print(category)
        # menu_items=""
        message1 = {
    "fulfillmentText": "Your text response",
    "fulfillmentMessages": [
        {
            "text": {
                "text": [
                    "Here are the categories"
                ]
            }
        },
        {
            "payload": {

            }
        }
    ]
        }
        message = {
            "richContent": [
                [
                ]
            ]
            }
        for x in category:
            # print(x['name']i)
            menu_category_rich = {
                "type": "list",
                "title": x['name'],
                }
            message['richContent'][0].append(menu_category_rich)
            message['richContent'][0].append({'type':'divider'})
        #     menu_items+=x['name']
        #     menu_items+=', '
        # menu_items = menu_items[:-2]
        # reply = {
        #     'fulfillmentText': str(menu_items)
        # }
        message1['fulfillmentMessages'][1]['payload'] = message
        return jsonify(message1)
    elif('review' in data['queryResult']['parameters']):
        reviews = review_db.find({})
        # print(reviews)
        message1 = {
            "fulfillmentText": "Your text response",
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            "Here are some reviews for this restaurant"
                        ]
                    }
                },
                {
                    "payload": {

                    }
                }
            ]
                }
        message = {
            "richContent": [
                [
                ]
            ]
            }
        z=0
        for x in reviews:
            print(x)
            if(z==3):break
            review_item = {
                "type": "list",
                "title": x['review'],
                "subtitle": f"Rating: {x['rating']}/5\nDate Reviewed: {x['date_time']}"
            }
            message['richContent'][0].append(review_item)
            message['richContent'][0].append({'type':'divider'})
            z+=1
        message1['fulfillmentMessages'][1]['payload'] = message
        return jsonify(message1)
    # print(reply)
    elif('suggestion' in data['queryResult']['parameters']):
        categories = list(menu_db.find({}))
        res = list()
        for cat in categories:
            for menu_item in cat['menu_items']:
                if menu_item['chefs_pick'] == True:
                    res.append(menu_item)

        message1 = {
            "fulfillmentText": "Your text response",
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            "Here are some chef's picks"
                        ]
                    }
                },
                {
                    "payload": {

                    }
                }
            ]
                }
        message = {
            "richContent": [
                [
                ]
            ]
            }
        for x in categories:
            for menu_item in x['menu_items']:
                if menu_item['chefs_pick'] == True:
                    menu_item_rich = {
                        "type": "list",
                        "title": menu_item['name'],
                        "subtitle": f"Description: {menu_item['description']}\nPrice: {menu_item['price']}",
                    }
                    message['richContent'][0].append(menu_item_rich)
                    message['richContent'][0].append({'type':'divider'})

        message1['fulfillmentMessages'][1]['payload'] = message
        return jsonify(message1)
    return jsonify(reply)

# @app.route('/send_message', methods=['POST'])
# def send_message():
#     message = request.form['message']
#     project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
#     session_client = dialogflow.SessionsClient()
#     session = session_client.session_path(project_id, "unique")
#     text_input = dialogflow.types.TextInput(
#                     text=message, language_code="en")
#     query_input = dialogflow.types.QueryInput(text=text_input)
#     response = session_client.detect_intent(
#                     session=session, query_input=query_input) 
#     print(response)
#     # fulfillment_text = detect_intent_texts(project_id, "unique", message, 'en')
#     response_text = { "message":  response.query_result.fulfillment_text }

#     return jsonify(response_text)
if __name__ == '__main__':
    # Setup for the Flask App
    api.init_app(app)
    # from hooks import socketio
    socketio.run(app, debug=True)
