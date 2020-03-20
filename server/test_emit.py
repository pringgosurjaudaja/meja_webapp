import app.socketio
from flask_socketio import emit

socketio.emit('update_order', {'data': 'testing'})