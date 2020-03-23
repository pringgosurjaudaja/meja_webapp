from flask_api import FlaskAPI
from flask_cors import CORS
from flask_socketio import SocketIO, Namespace, emit, send, join_room, leave_room
from apis import api
from hooks.admin_hooks import AdminNamespace
from hooks.customer_hooks import CustomerNamespace

app = FlaskAPI(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins='*')

socketio.on_namespace(AdminNamespace('/admin'))
socketio.on_namespace(CustomerNamespace('/customer'))

if __name__ == '__main__':
    # Setup for the Flask App
    api.init_app(app)
    # from hooks import socketio
    socketio.run(app, debug=True)
