from app import app
from flask_socketio import SocketIO, emit

socketio = SocketIO(app)

@socketio.on('update_order')
def handle_update_order(json):
    print(json)
    print('hello world')
    emit('updateOrder')