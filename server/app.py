from flask_api import FlaskAPI
from flask_cors import CORS
from flask_socketio import SocketIO, Namespace, emit, send, join_room, leave_room
from flask import render_template, jsonify, request, make_response
import os
import re
import pprint
import requests
import json
import dialogflow_v2 as dialogflow
from apis import api
from bson import ObjectId
from db import db_client
from dotenv import load_dotenv
from apis.Chatbot.chatbot import handle_chats
load_dotenv()

menu_db = db_client.menu
review_db = db_client.review
session_db = db_client.session
table_db = db_client.table

app = FlaskAPI(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins='*')

ADMIN_ROOM = 'admins'

# region Customer Orders
@socketio.on('admin_join')
def on_admin_join():
    print('Admin Joined')
    join_room(ADMIN_ROOM)

@socketio.on('customer_join')
def on_customer_join(table_id):
    # Treat table as a room to receive updates on new orders and 
    # waiter calls
    join_room(table_id)

@socketio.on('customer_order')
def on_customer_order(order):
    print('Received customer order')
    pprint.pprint(order)
    # Inform order room that a new order has been received
    emit('newCustomerOrder', room=ADMIN_ROOM)

@socketio.on('orderUpdated')
def handle_order_update(table_id):
    emit('updateOrders', table_id, room=table_id)
# endregion

# region Handle Calling Waiter
@socketio.on('call_waiter')
def on_call_waiter(table_id, calling):
    # Inform admins to update their tables
    print('Customer calling a Waiter')
    print('{} {}'.format(table_id, str(calling)))
    emit('customerCallingWaiter', (table_id, calling), room=ADMIN_ROOM)

@socketio.on('call_waiter_toggled')
def on_call_waiter_toggle(table_id):
    # Inform customer that their call waiter status has been handled
    emit('callWaiterToggled', room=table_id)
# endregion

# region Customer paying
@socketio.on('customer_paying')
def on_customer_paying(table_id):
    emit('customerPaying', table_id, room=ADMIN_ROOM)

# endregion




@app.route('/handle_chat', methods=['POST'])
def handle_chat():
    return handle_chats()

if __name__ == '__main__':
    # Setup for the Flask App
    api.init_app(app)
    # from hooks import socketio
    socketio.run(app, debug=True)
