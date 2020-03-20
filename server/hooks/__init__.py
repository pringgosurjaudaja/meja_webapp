from app import socketio
from flask_socketio import emit

@socketio.on('update_order')
def handle_update_order(json):
    print(json)
    emit('updateOrder')