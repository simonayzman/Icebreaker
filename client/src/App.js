import React, { Component } from 'react';
import io from 'socket.io-client';
import keymirror from 'keymirror';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { IoMdArrowRoundBack } from 'react-icons/io';

import 'bootstrap/dist/css/bootstrap.min.css';

import HomeScreen from './containers/HomeScreen';
import RoomIntroScreen from './containers/RoomIntroScreen';
import QuestionRankerScreen from './containers/QuestionRankerScreen';
import { CONFIG } from './lib/config';

import './styles/App.css';

const socket = io();

const PAGES = keymirror({
  Home: null,
  RoomIntro: null,
  QuestionRanker: null,
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
      userName: null,
      userQuestionRankings: null,
      roomCode: null,
      roomName: null,
      roomSelection: null,
      page: PAGES.QuestionRanker, // REMOVE
    };
  }

  componentDidMount() {
    this.hydrateFromLocalStorage();
    socket.on('connect', () => console.log('Socket connected on the front-end.'));
    socket.on('join_room_success', data => console.log('Successfully joined room: ', data));
  }

  hydrateFromLocalStorage = () => {
    try {
      const userId = localStorage.getItem('user-id');
      const userName = localStorage.getItem('user-name');
      const userQuestionRankings = JSON.parse(localStorage.getItem('user-question-rankings'));
      const roomCode = localStorage.getItem('room-code');
      const roomName = localStorage.getItem('room-name');
      this.setState({ userId, userName, roomCode, roomName, userQuestionRankings });
      console.log('Hydrating from local storage');
      console.log(`User ID: ${userId}`);
      console.log(`User Name: ${userName}`);
      console.log(`User Question Rankings: `, userQuestionRankings);
      console.log(`Room Code: ${roomCode}`);
      console.log(`Room Name: ${roomName}`);

      if (userId === null) {
        const newId = uuid();
        const modifiedId = newId.replace(/\W/g, '');
        console.log('Setting new user id: ', modifiedId);
        localStorage.setItem('user-id', modifiedId);
        this.setState({ userId: modifiedId });
      }
    } catch (error) {
      console.log('Local storage hydration error: ', error);
    }
  };

  saveUserRoom = (userName, roomCode, roomName) => {
    try {
      localStorage.setItem('user-name', userName);
      localStorage.setItem('room-code', roomCode);
      localStorage.setItem('room-name', roomName);
    } catch (error) {
      console.log('Local storage saving error: ', error);
    }
  };

  saveUserQuestionRankings = questionRankings => {
    try {
      localStorage.setItem('user-question-rankings', JSON.stringify(questionRankings));
    } catch (error) {
      console.log('Local storage saving error: ', error);
    }
  };

  onJoinRoom = (room, user) => {
    const { userId, userQuestionRankings } = this.state;
    const { roomCode, roomName } = room;
    const { userName, userDescription } = user;

    socket.emit('join_room', { roomCode, user: { userId, userName, userDescription } });
    this.setState({
      userName,
      roomCode,
      roomName,
      page: userQuestionRankings == null ? PAGES.QuestionRanker : PAGES.Home,
      page: PAGES.QuestionRanker, // REMOVE
    });
    this.saveUserRoom(userName, roomCode, roomName);
  };

  onBack = () => {
    const { page } = this.state;

    switch (page) {
      case PAGES.RoomIntro:
        this.setState({ page: PAGES.Home });
        break;
      case PAGES.QuestionRanker:
        this.setState({ page: PAGES.RoomIntro });
        break;
      default:
        break;
    }
  };

  onRankAllQuestions = questionRankings => {
    this.setState({ userQuestionRankings: questionRankings });
    this.saveUserQuestionRankings(questionRankings);
  };

  renderQuestionPreferenceSelector() {
    return null;
  }

  render() {
    const { page, userId, userName, roomSelection, roomCode, roomName } = this.state;

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
            roomNameHint={roomName}
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
            userNameHint={userName}
            roomCodeHint={roomCode}
            roomSelection={roomSelection}
            onJoinRoom={this.onJoinRoom}
          />
        );
        break;
      case PAGES.QuestionRanker:
        component = <QuestionRankerScreen onRankAll={this.onRankAllQuestions} />;
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
