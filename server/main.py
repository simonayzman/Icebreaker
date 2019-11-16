# Package imports
from configs import get_config
from os import environ
from flask import Flask, render_template, send_from_directory, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
from flask_debug import Debug
from datetime import datetime
from uuid import uuid4
import urllib
from json import dumps
import google

# Local imports
import env
from firebase import rooms_ref
from configs import get_config
from match import determine_matches

app = Flask(
    __name__,
    static_folder=get_config()["static"],
    template_folder=get_config()["template"],
)
Debug(app)
CORS(app)
socketio = SocketIO(app, async_mode="eventlet")

# App routes
@app.route("/")
def index():
    config_json_string = dumps(get_config(platform="client"))
    return render_template("index.html", config=config_json_string)


@app.route("/<path:path>")
def index_resource(path):
    return send_from_directory(get_config()["template"], path)


@app.route("/createRoom")
def create_room():
    room_code = urllib.parse.unquote(request.args.get("roomCode"))
    room_name = urllib.parse.unquote(request.args.get("roomName"))
    initial_data = {
        "meta": {"roomCode": room_code, "roomName": room_name},
        "users": {},
        "matches": {},
    }

    response = None
    try:
        room = rooms_ref.document(room_code).get().to_dict()
        if room is None:
            rooms_ref.document(room_code).set(initial_data)
            response = {"ok": True}
        else:
            response = {
                "error": True,
                "errorType": "Room already exists.",
                "room": room,
            }
    except:
        response = {"error": True, "errorType": "Unknown error"}

    if response.get("error"):
        print(f"Room creation for code {room_code} error: {response}\n")
    else:
        print(f"Room creation for code {room_code} successful.\n")

    return jsonify(response)


@app.route("/checkRoom")
def check_room():
    room_code = urllib.parse.unquote(request.args.get("roomCode"))
    room = rooms_ref.document(room_code).get().to_dict()

    response = None
    if room is None:
        response = {"error": True}
    else:
        response = room

    if response.get("error"):
        print(f"Room creation for code {room_code} error: {response}\n")
    else:
        print(f"Room creation for code {room_code} successful.\n")

    return jsonify(response)


# Socket connections
@socketio.on("connect")
def on_connect():
    print("Socket connected on the back-end.\n")


@socketio.on("rejoin_room")
def on_rejoin_room(data):
    print(f"Re-joining room: {data}\n")
    room_code = data["roomCode"]
    user_id = data["userId"]
    join_room(room_code)
    emit("rejoin_room_success", {"roomCode": room_code, "userId": user_id})


@socketio.on("join_room")
def on_join_room(data):
    print(f"Joining room: {data}\n")
    room_code = data["roomCode"]
    user = data["user"]
    user_id = user["userId"]
    join_room(room_code)
    rooms_ref.document(room_code).update({f"users.{user_id}": user})
    emit("join_room_success", user)


# Consider using a queue for synchronous updates
@socketio.on("update_question_rankings")
def on_update_question_rankings(data):
    print(f"Updating question rankings: {data}\n")
    user_id = data["userId"]
    user_question_rankings = data["userQuestionRankings"]
    room_code = data["roomCode"]

    # Synchronize current user state
    rooms_ref.document(room_code).update(
        {f"users.{user_id}.userQuestionRankings": user_question_rankings})
    room_data = rooms_ref.document(room_code).get().to_dict()
    users = room_data["users"]

    # Determine matches
    matches = determine_matches(user_id, room_data)
    rooms_ref.document(room_code).update({f"matches": matches})
    emit("update_matches", {"matches": matches,
                            "users": users}, room=room_code)
