import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import io from 'socket.io-client';
import keymirror from 'keymirror';
import uuid from 'uuid/v4';
import { IoMdArrowRoundBack } from 'react-icons/io';

import 'bootstrap/dist/css/bootstrap.min.css';

import HomeScreen from './containers/HomeScreen';
import RoomIntroScreen from './containers/RoomIntroScreen';
import QuestionRankerScreen from './containers/QuestionRankerScreen';
import MatchedUsersScreen from './containers/MatchedUsersScreen';
import colors from './lib/colors';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${colors.app};
`;

const Header = styled.header`
  position: relative;
  min-height: 100vh;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 20px;
  ${({ navigating }) =>
    navigating
      ? css`
          transition: opacity 500ms, transform 500ms;
          opacity: 0;
          ${({ navigatedBack }) =>
            navigatedBack === true
              ? 'transform: translateX(100px);'
              : 'transform: translateX(-100px);'}
        `
      : `
        transition: opacity 500ms;
        opacity: 1;
        transform: translateX(0);
      `}
`;

const socket = io();

const PAGES = keymirror({
  Home: null,
  RoomIntro: null,
  QuestionRanker: null,
  Room: null,
  MatchedUsers: null,
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
      navigating: false,
      navigatedBack: false,
      devResetCount: 0,
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

  onDevReset = () => {
    const { devResetCount } = this.state;

    let newDevResetCount = devResetCount + 1;
    if (devResetCount === 0) {
      localStorage.removeItem('user-question-rankings');
      this.setState({ userQuestionRankings: null });
    } else if (devResetCount === 1) {
      localStorage.removeItem('user-name');
      localStorage.removeItem('user-id');
      localStorage.removeItem('room-code');
      localStorage.removeItem('room-name');
      window.location.reload();
    }

    this.setState({ devResetCount: newDevResetCount });
  };

  onStartCreateRoom = () => {
    this.setState({ roomSelection: 'create' });
    this.navigate(PAGES.RoomIntro);
  };

  onStartJoinRoom = () => {
    this.setState({ roomSelection: 'join' });
    this.navigate(PAGES.RoomIntro);
  };

  onJoinRoom = (room, user) => {
    const { userId, userQuestionRankings } = this.state;
    const { roomCode, roomName } = room;
    const { userName, userDescription } = user;

    socket.emit('join_room', { roomCode, user: { userId, userName, userDescription } });
    this.setState({ userName, roomCode, roomName });
    this.navigate(userQuestionRankings == null ? PAGES.QuestionRanker : PAGES.MatchedUsers);
    this.saveUserRoom(userName, roomCode, roomName);
  };

  onBack = () => {
    const { page } = this.state;

    switch (page) {
      case PAGES.RoomIntro:
        this.navigate(PAGES.Home, true);
        break;
      case PAGES.QuestionRanker:
        this.navigate(PAGES.Home, true);
        break;
      case PAGES.MatchedUsers:
        this.navigate(PAGES.Home, true);
        break;
      default:
        break;
    }
  };

  onRankAllQuestions = questionRankings => {
    this.setState({ userQuestionRankings: questionRankings });
    this.saveUserQuestionRankings(questionRankings);
  };

  onEnterRoom = () => {
    this.navigate(PAGES.MatchedUsers);
  };

  navigate = (page, goingBack = false) => {
    this.setState({ navigating: true, navigatedBack: goingBack });
    setTimeout(() => this.setState({ page, navigating: false, navigatedBack: false }), 500);
  };

  render() {
    const {
      page,
      userId,
      userName,
      roomSelection,
      roomCode,
      roomName,
      navigating,
      navigatedBack,
    } = this.state;

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
            onStartCreateRoom={this.onStartCreateRoom}
            onStartJoinRoom={this.onStartJoinRoom}
            onClickLogo={this.onDevReset}
          />
        );
        break;
      case PAGES.RoomIntro:
        component = (
          <RoomIntroScreen
            userNameHint={userName}
            roomCodeHint={roomCode}
            roomSelection={roomSelection}
            onJoinRoom={this.onJoinRoom}
          />
        );
        break;
      case PAGES.QuestionRanker:
        component = (
          <QuestionRankerScreen
            onRankAll={this.onRankAllQuestions}
            onEnterRoom={this.onEnterRoom}
          />
        );
        break;
      case PAGES.MatchedUsers:
        component = <MatchedUsersScreen />;
        break;
      default:
        component = <h1>{'NO SCREEN'}</h1>;
    }

    return (
      <AppContainer>
        <Header navigating={navigating} navigatedBack={navigatedBack}>
          {component}
          {page !== PAGES.Home ? backButton : null}
        </Header>
      </AppContainer>
    );
  }
}
