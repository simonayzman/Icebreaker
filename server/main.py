from os import environ

from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
from flask_debug import Debug

app = Flask(
    "__main__",
    static_folder="../client/build/static",
    template_folder="../client/build"
)

Debug(app)
CORS(app)
socketio = SocketIO(app)

# App routes
@app.route("/")
def index():
    return render_template("index.html", token="Hello flask")

@app.route("/<path:path>")
def indexPath(path):
    return send_from_directory("../client/build", path)

# Socket connections
@socketio.on('connect')
def on_connect():
    print('Socket connected on the back-end.')

@socketio.on('join_room')
def on_join(data):
    print('room joined')
    room = data['room']
    join_room(room)
    emit('open_room', {'room': room}, broadcast=True)

@socketio.on('send_message')
def on_chat_sent(data):
    print('message sent')
    room = data['room']
    emit('message_sent', data, room=room)

socketio.run(app, debug=True)
