from os import environ

from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room

app = Flask("__main__")

@app.route("/")
def index():
    return render_template("index.html", token="Hello flask")

app.run(debug=True, host='0.0.0.0', port=environ.get('PORT', 5000))

socketio = SocketIO(app)
socketio.run(app)

@socketio.on('connect')
def on_connect():
    print('user connected')

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