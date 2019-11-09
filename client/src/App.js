import React, { Component } from 'react';
import io from 'socket.io-client';
import keymirror from 'keymirror';

import 'bootstrap/dist/css/bootstrap.min.css';

import HomeScreen from './containers/HomeScreen';
import RoomIntroScreen from './containers/RoomIntroScreen';
import { CONFIG } from './lib/config';

import './styles/App.css';

const socket = io();

const questionsConfig = {
  allQuestionIds: [],
  questions: {
    '1': {},
  },
};

const PAGES = keymirror({
  Home: null,
  RoomIntro: null,
  QuestionerRanker: null,
  Room: null,
  MatchedUser: null,
});

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      page: PAGES.Home,
      userId: null,
      roomCode: null,
      roomSelection: null,
    };
  }

  componentDidMount() {
    this.hydrateUserId();
    socket.on('connect', () => console.log('Socket connected on the front-end.'));
    socket.on('join_room_success', data => console.log('Successfully joined room: ', data));
  }

  generateUserId = length => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  hydrateUserId = () => {
    try {
      const value = localStorage.getItem('user-id');
      if (value !== null) {
        console.log('Hydrating user id: ', value);
        this.setState({ userId: value });
      } else {
        const newId = this.generateUserId(10);
        console.log('Setting new user id: ', newId);
        localStorage.setItem('user-id', newId);
        this.setState({ userId: newId });
      }
    } catch (error) {
      console.log('Local storage error: ', error);
    }
  };

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

  onStartCreateRoom = () => {
    console.log('Starting room creation flow!');
    this.setState({ page: PAGES.RoomIntro, roomSelection: 'create' });
  };

  onStartJoinRoom = () => {
    console.log('Starting room joining flow!');
    this.setState({ page: PAGES.RoomIntro, roomSelection: 'join' });
  };

  renderQuestionPreferenceSelector() {
    return null;
  }

  render() {
    const { page, userId, roomSelection } = this.state;

    let component;
    switch (page) {
      case PAGES.Home:
        component = (
          <HomeScreen
            onStartCreateRoom={this.onStartCreateRoom}
            onStartJoinRoom={this.onStartJoinRoom}
          />
        );
        break;
      case PAGES.RoomIntro:
        component = <RoomIntroScreen userId={userId} roomSelection={roomSelection} />;
        break;
      default:
        component = <h1>{'NO SCREEN'}</h1>;
    }

    return (
      <div className="App">
        <header className="App-header">
          {component}
          <p>{CONFIG.token}</p>
        </header>
      </div>
    );
  }
}
