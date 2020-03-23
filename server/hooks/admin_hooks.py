from flask_socketio import Namespace, join_room, leave_room, emit

'''
EVENT-NAMING CONVENTIONS:
    * Snake Case --> Events on the server side
    * Camel Case --> Events on the client side
'''

class AdminNamespace(Namespace):
    def on_new_order(self, data):
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