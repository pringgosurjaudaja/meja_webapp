from flask_api import FlaskAPI
from flask_cors import CORS
from flask_socketio import SocketIO, Namespace, emit, send, join_room, leave_room
from apis import api
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
def on_customer_order(data):
    room = data['table_id']
    print('Received customer order')
    print()
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

if __name__ == '__main__':
    # Setup for the Flask App
    api.init_app(app)
    # from hooks import socketio
    socketio.run(app, debug=True)
