from os import environ
from flask import Flask, render_template, send_from_directory, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
from flask_debug import Debug
from datetime import datetime
from uuid import uuid4
import json

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from dotenv import load_dotenv

load_dotenv()

cred_val = environ.get("GOOGLE_CREDENTIALS")
if cred_val == None:
    print("Didn't find environment credentials! Reverting to local file.")
    cred = credentials.Certificate("./keys.json")
else:
    print("Found environment credentials! Converting to json.")
    cred_json = json.loads(cred_val)
    cred = credentials.Certificate(cred_json)
firebase_admin.initialize_app(cred)
db = firestore.client()
users_ref = db.collection("users")
rooms_ref = db.collection("rooms")

configs = {
    "development": {
        "client": {
            "token": "((( DEV ENV )))",
            "api": "http://localhost",
            "port": 8000,
        },
        "server": {"static": "../client/build", "template": "../client/build"},
    },
    "production": {
        "client": {
            "token": "((( PROD ENV )))",
            "api": "https://deep-dive-072193.herokuapp.com",
            # "port": environ.get("PORT"),
        },
        "server": {
            "static": "../client/build/static",
            "template": "../client/build",
        },
    },
}


def getConfig(platform="server"):
    return configs[environ.get("FLASK_ENV")][platform]


app = Flask(
    __name__,
    static_folder=getConfig()["static"],
    template_folder=getConfig()["template"],
)
Debug(app)
CORS(app)
socketio = SocketIO(app, async_mode="eventlet")

# App routes
@app.route("/")
def index():
    config_json_string = json.dumps(getConfig(platform="client"))
    return render_template("index.html", config=config_json_string)


@app.route("/<path:path>")
def indexPath(path):
    return send_from_directory(getConfig()["template"], path)


@app.route("/createRoom")
def createRoomPath():
    roomCode = request.args.get("roomCode")
    initialData = {"users": {}, "matches": {}}

    response = None
    try:
        rooms_ref.document(roomCode).set(initialData)
        response = {"ok": True}
    except:
        response = {"error": True}

    print(f"Room creation for code {roomCode} yielded response: {response}")

    return jsonify(response)


@app.route("/checkRoom")
def checkRoomPath():
    roomCode = request.args.get("roomCode")
    room = rooms_ref.document(roomCode).get().to_dict()

    response = None
    if room is None:
        response = {"error": True}
    else:
        response = room

    print(f"Looking for room {roomCode} yielded response: {response}")

    return jsonify(response)


# Socket connections
@socketio.on("connect")
def on_connect():
    print("Socket connected on the back-end.")


@socketio.on("join_room")
def on_client_request(data):
    print(f"Joining room with data: {data}")
    roomCode = data["roomCode"]
    user = data["user"]
    userId = user["userId"]
    rooms_ref.document(roomCode).update({f"users.{userId}": user})
    emit("join_room_success", user)




# @socketio.on("join_room")
# def on_join(data):
#     print("room joined")
#     room = data["room"]
#     join_room(room)
#     emit("open_room", {"room": room}, broadcast=True)


# @socketio.on("send_message")
# def on_chat_sent(data):
#     print("message sent")
#     room = data["room"]
#     emit("message_sent", data, room=room)
