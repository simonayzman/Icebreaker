import React, { Component } from 'react';
import io from 'socket.io-client';

import './App.css';

const CONFIG = window.config || { token: 'Hello DEV Flask', api: 'http://localhost', port: 8000 };
const API = `${CONFIG.api}:${CONFIG.port}`;

const socket = io();

const questionsConfig = {
  allQuestionIds: [],
  questions: {
    '1': {},
  },
};

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      room: '',
    };
  }

  componentDidMount() {
    socket.on('connect', () => console.log('Socket connected on the front-end.'));
    socket.on('join_room_success', data => console.log('Successfully joined room: ', data));
  }

  onSubmitRoom = event => {
    socket.emit('join_room', {
      room: this.state.room,
      user: window.location.href,
      timestamp: Date.now(),
    });
    event.preventDefault(); // prevent page reload
  };

  onChangeRoom = event => {
    this.setState({ room: event.target.value });
  };

  renderQuestionPreferenceSelector() {
    return null;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>{CONFIG.token}</p>
          <form onSubmit={this.onSubmitRoom}>
            <label>
              Room:
              <input type="text" value={this.state.room} onChange={this.onChangeRoom} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </header>
      </div>
    );
  }
}
