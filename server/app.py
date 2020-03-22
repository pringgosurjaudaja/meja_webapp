from flask_api import FlaskAPI
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from apis import api

app = FlaskAPI(__name__)
CORS(app)

if __name__ == '__main__':
    # Setup for the Flask App
    api.init_app(app)
    from hooks import socketio
    socketio.run(app, debug=True)
