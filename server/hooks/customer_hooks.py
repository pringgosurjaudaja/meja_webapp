from flask_socketio import Namespace, join_room, leave_room, emit

'''
EVENT-NAMING CONVENTIONS:
    * Snake Case --> Events on the server side
    * Camel Case --> Events on the client side
'''

class CustomerNamespace(Namespace):
    def on_new_order(self, data):
        '''Inform admin-clients of the customer's order.'''
        print(data)
        room = data['order_id']
        join_room(room)
        print('Hello world')
        emit('new_order', data, namespace='/admin')
    
    def on_complete_order(self, data):
        room = data['order_id']
        leave_room(room)
        emit('complete_order', data, namespace='/admin')