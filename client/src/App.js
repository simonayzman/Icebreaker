import React, { Component } from 'react';
import io from 'socket.io-client';
import keymirror from 'keymirror';
import uuid from 'uuid/v4';

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

  hydrateUserId = () => {
    try {
      const value = localStorage.getItem('user-id');
      if (value !== null) {
        console.log('Hydrating user id: ', value);
        this.setState({ userId: value });
      } else {
        const newId = uuid();
        console.log('Setting new user id: ', newId);
        localStorage.setItem('user-id', newId);
        this.setState({ userId: newId });
      }
    } catch (error) {
      console.log('Local storage error: ', error);
    }
  };

  onJoinRoom = data => {
    const { userId } = this.state;
    const { roomCode, name, description } = data;
    socket.emit('join_room', { roomCode, user: { userId, name, description } });
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
            onStartCreateRoom={() =>
              this.setState({ page: PAGES.RoomIntro, roomSelection: 'create' })
            }
            onStartJoinRoom={() => this.setState({ page: PAGES.RoomIntro, roomSelection: 'join' })}
          />
        );
        break;
      case PAGES.RoomIntro:
        component = (
          <RoomIntroScreen
            userId={userId}
            roomSelection={roomSelection}
            onGoBackToHomeScreen={() => this.setState({ page: PAGES.Home })}
            onJoinRoom={this.onJoinRoom}
          />
        );
        break;
      default:
        component = <h1>{'NO SCREEN'}</h1>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <p>{CONFIG.token}</p>
          {component}
        </header>
      </div>
    );
  }
}
