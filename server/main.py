from os import environ

from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
from flask_debug import Debug
import json

configs = {
    "development": {
        "client": {
            "token": "Hello DEV Flask",
            "api": "http://localhost",
            "port": 5000,
        },
        "server": {
            "static": "../client/build",
            "template": "../client/build",
        },
    },
    "production": {
        "client": {
            "token": "Hello PROD Flask",
            "api": "https://deep-dive-072193.herokuapp.com",
            "port": environ.get('PORT'),
        },
        "server": {
            "static": "../client/build/static",
            "template": "../client/build",
        },
    },
   
}

app = Flask(
    __name__,
    static_folder=configs[environ.get('FLASK_ENV')]['server']["static"],
    template_folder=configs[environ.get('FLASK_ENV')]['server']["template"],
)
Debug(app)
CORS(app)
socketio = SocketIO(app)

# App routes
@app.route("/")
def index():
    config_json_string = json.dumps(configs[environ.get('FLASK_ENV')]['client'])
    return render_template("index.html", config=config_json_string)

@app.route("/<path:path>")
def indexPath(path):
    return send_from_directory(configs[environ.get('FLASK_ENV')]['server']["template"], path)

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

socketio.run(app, debug=True, port=configs[environ.get('FLASK_ENV')]['client']['port'])
