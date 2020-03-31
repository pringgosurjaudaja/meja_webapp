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

load_dotenv()

menu_db = db_client.menu
# from hooks.admin_hooks import AdminNamespace
# from hooks.customer_hooks import CustomerNamespace

app = FlaskAPI(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins='*')

ADMIN_ROOM = 'admins'

class CustomerNamespace(Namespace):
    def on_new_order(self, data):
        '''Inform admin-clients of the customer's order.'''
        print(data)
        room = data['order_id']
        join_room(room)
        join_room(ADMIN_ROOM)
        print('Hello world')
        emit('customer_order', data, room=ADMIN_ROOM, broadcast=True)
    
    def on_complete_order(self, data):
        room = data['order_id']
        leave_room(room)
        socketio.emit('complete_order', data, namespace='/admin')

@socketio.on('customer_order')
def on_customer_order(self, data):
    print('HELLO WORLLDLDD')
    room = data['order_id']
    print('Received customer order')
    # Inform order room that order has been received
    emit('orderReceived', data, room=room)


class AdminNamespace(Namespace):
    def on_new_order(self, data):
        print('HELLO WORLLDLDD')
        room = data['order_id']
        print('Received customer order')
        # Inform order room that order has been received
        emit('orderReceived', data, room=room)
    
    def on_update_order(self, data):
        room = data['order_id']
        new_order_status = data['order_status']
        # Inform other admin-clients of new order status
        emit('updateOrder', new_order_status)
        # Inform customers of their updated order status
        emit('updateOrder', new_order_status, room=room)
    
    def on_complete_order(self, data):
        # Add completed order to database
        pass

admin_namespace = AdminNamespace('/admin')
customer_namespace = CustomerNamespace('/customer')

socketio.on_namespace(admin_namespace)
socketio.on_namespace(customer_namespace)


@app.route('/test')
def index():
    print(os.getenv('DIALOGFLOW_PROJECT_ID'))
    return render_template('chatbot.html')

@app.route('/get_menu_category', methods=['POST'])
def get_menu_category():
    data = request.get_json(silent=True)
    print(data['queryResult']['parameters'])
    if 'menu_item' in data['queryResult']['parameters']:
        menu_item = data['queryResult']['parameters']['menu_item']
        menu_item_queried = menu_db.aggregate([
                {'$unwind': '$menu_items'},
                {'$match':{"menu_items.name": menu_item}},
                
                {'$project': {
                            'name': '$menu_items.name',
                            'price': '$menu_items.price'
                }}
        ])
        item = menu_item_queried.next()
        reply = {
            'fulfillmentText': str(item),
        }
        return jsonify(reply)
    menu_category = data['queryResult']['parameters']['menu_category']
    category = menu_db.find_one({'name': menu_category})
    category['_id'] = str(category['_id'])
    reply = {
        'fulfillmentText': str(category),
    }
    # print(reply)
    return jsonify(reply)
def results():
    # build a request object
    req = request.get_json(force=True)

    # fetch action from json
    action = req.get('queryResult').get('action')

    # return a fulfillment response
    return {'fulfillmentText': 'This is a response from webhook.'}

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

@app.route('/get_movie_detail', methods=['POST'])
def get_movie_detail():
    data = request.get_json(silent=True)
    movie = data['queryResult']['parameters']['movie']
    api_key = "e4625d08"

    movie_detail = requests.get('http://www.omdbapi.com/?t={0}&apikey={1}'.format(movie, api_key)).content
    movie_detail = json.loads(movie_detail)
    response =  """
        Title : 0
        Released: 1
        Actors: 2
        Plot: 3
    """
    print(response)
    reply = {
        "fulfillmentText": response,
    }

    return jsonify(reply)