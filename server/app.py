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
from apis.chatbot import handle_chats
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
def on_call_waiter(table_id):
    join_room(table_id)
    # Inform admins to update their tables
    emit('customerCallingWaiter', room=ADMIN_ROOM)

@socketio.on('call_waiter_toggled')
def on_call_waiter_toggle(table_id):
    # Inform customer that their call waiter status has been handled
    emit('callWaiterToggled', room=table_id)

# endregion




@app.route('/handle_chat', methods=['POST'])
def handle_chat():
    return handle_chats()

if __name__ == '__main__':
    # Setup for the Flask App
    api.init_app(app)
    # from hooks import socketio
    socketio.run(app, debug=True)
