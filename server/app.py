from flask_api import FlaskAPI
from flask_cors import CORS
from flask_socketio import SocketIO, Namespace, emit, send, join_room, leave_room
from apis import api
from flask import render_template, jsonify, request, make_response
import dialogflow_v2 as dialogflow
import requests
import json
from db import db_client
import os
from dotenv import load_dotenv
import re
load_dotenv()

menu_db = db_client.menu
import pprint
# from hooks.admin_hooks import AdminNamespace
# from hooks.customer_hooks import CustomerNamespace

app = FlaskAPI(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins='*')

ADMIN_ROOM = 'admins'

# class CustomerNamespace(Namespace):
#     def on_new_order(self, data):
#         '''Inform admin-clients of the customer's order.'''
#         print(data)
#         room = data['order_id']
#         join_room(room)
#         join_room(ADMIN_ROOM)
#         print('Hello world')
#         emit('customer_order', data, room=ADMIN_ROOM, broadcast=True)
    
#     def on_complete_order(self, data):
#         room = data['order_id']
#         leave_room(room)
#         socketio.emit('complete_order', data, namespace='/admin')

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

# class AdminNamespace(Namespace):
#     def on_new_order(self, data):
#         print('HELLO WORLLDLDD')
#         room = data['order_id']
#         print('Received customer order')
#         # Inform order room that order has been received
#         emit('orderReceived', data, room=room)
    
#     def on_update_order(self, data):
#         room = data['order_id']
#         new_order_status = data['order_status']
#         # Inform other admin-clients of new order status
#         emit('updateOrder', new_order_status)
#         # Inform customers of their updated order status
#         emit('updateOrder', new_order_status, room=room)
    
#     def on_complete_order(self, data):
#         # Add completed order to database
#         pass

# admin_namespace = AdminNamespace('/admin')
# customer_namespace = CustomerNamespace('/customer')

# socketio.on_namespace(admin_namespace)
# socketio.on_namespace(customer_namespace)


@app.route('/test')
def index():
    print(os.getenv('DIALOGFLOW_PROJECT_ID'))
    return render_template('chatbot.html')

@app.route('/get_menu_category', methods=['POST'])
def get_menu_category():
    data = request.get_json(silent=True)
    print(data['queryResult']['parameters'])
    if 'menu_item' in data['queryResult']['parameters']:
        menu_item_raw = data['queryResult']['parameters']['menu_item']
        # menu_item = string.capwords(menu_item_raw)
        menu_item_queried = menu_db.aggregate([
                {'$unwind': '$menu_items'},
                {'$match':{"menu_items.name": re.compile(menu_item_raw, re.IGNORECASE)}},
                
                {'$project': {
                            'name': '$menu_items.name',
                            'price': '$menu_items.price'
                }}
        ])
        item = menu_item_queried.next()
        item_string = """
            Item name: {0},
            Price: ${1}
        """.format(item['name'], item['price'])
        reply = {
            'fulfillmentText': item_string,
        }
        print(reply)
        return jsonify(reply)
    elif('menu_category' in data['queryResult']['parameters']):
        menu_category = data['queryResult']['parameters']['menu_category']
        category = menu_db.find_one({'name': re.compile(menu_category, re.IGNORECASE)})
        menu_items = []
        for x in category['menu_items']:
            menu_items.append(x['name'])
        print(menu_items)
        category['_id'] = str(category['_id'])
        reply = {
            'fulfillmentText': str(menu_items),
        }
    elif('menu_category_general' in data['queryResult']['parameters']):
        category = menu_db.find({})
        print(category)
        menu_items=""
        for x in category:
            print(x['name'])
            menu_items+=x['name']
            menu_items+=', '
        menu_items = menu_items[:-2]
        reply = {
            'fulfillmentText': str(menu_items)
        }
    # print(reply)
    return jsonify(reply)

@app.route('/send_message', methods=['POST'])
def send_message():
    message = request.form['message']
    project_id = os.getenv('DIALOGFLOW_PROJECT_ID')
    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(project_id, "unique")
    text_input = dialogflow.types.TextInput(
                    text=message, language_code="en")
    query_input = dialogflow.types.QueryInput(text=text_input)
    response = session_client.detect_intent(
                    session=session, query_input=query_input) 
    print(response)
    # fulfillment_text = detect_intent_texts(project_id, "unique", message, 'en')
    response_text = { "message":  response.query_result.fulfillment_text }

    return jsonify(response_text)
if __name__ == '__main__':
    # Setup for the Flask App
    api.init_app(app)
    # from hooks import socketio
    socketio.run(app, debug=True)
