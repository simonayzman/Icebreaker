import React, { Component } from 'react';
import io from 'socket.io-client';
import keymirror from 'keymirror';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { IoMdArrowRoundBack } from 'react-icons/io';

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

const BackButtonContainer = styled.div`
  position: absolute;
  left: 20px;
  bottom: 20px;
`;

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
        const modifiedId = newId.replace(/\W/g, '');
        console.log('Setting new user id: ', modifiedId);
        localStorage.setItem('user-id', modifiedId);
        this.setState({ userId: modifiedId });
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

  onBack = () => {
    const { page } = this.state;

    switch (page) {
      case PAGES.RoomIntro:
        this.setState({ page: PAGES.Home });
        break;
      default:
        break;
    }
  };

  renderQuestionPreferenceSelector() {
    return null;
  }

  render() {
    const { page, userId, roomSelection } = this.state;

    const backButton = (
      <BackButtonContainer onClick={this.onBack}>
        <IoMdArrowRoundBack size="35px" />
      </BackButtonContainer>
    );

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
          {page !== PAGES.Home ? backButton : null}
        </header>
      </div>
    );
  }
}
