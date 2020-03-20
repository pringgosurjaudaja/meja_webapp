from flask_api import FlaskAPI
from flask_cors import CORS
from flask_socketio import SocketIO
from apis import api
from json_encoder import MongoJSONEncoder
import hooks

app = FlaskAPI(__name__)
CORS(app)
socketio = SocketIO(app)
app.json_encoder = MongoJSONEncoder

if __name__ == '__main__':
    # Setup for the Flask App
    api.init_app(app)
    socketio.run(app, debug=True)
