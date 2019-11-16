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
import RoomScreen from './containers/RoomScreen';
import MatchedUserScreen from './containers/MatchedUserScreen';
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
  padding: 60px 20px 20px 20px;
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

const BackButtonContainer = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
`;

const socket = io();

const PAGES = keymirror({
  Home: null,
  RoomIntro: null,
  QuestionRanker: null,
  Room: null,
  MatchedUser: null,
});

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      page: PAGES.Home,
      userId: null,
      userName: null,
      userDescription: null,
      userQuestionRankings: null,
      userMatches: null,
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
    socket.on('connect', this.onConnectSocket);
    socket.on('join_room_success', data => console.log('Successfully joined room.', data));
    socket.on('rejoin_room_success', data => console.log('Successfully re-joined room.', data));
    socket.on('update_matches', this.onUpdateMatches);
  }

  hydrateFromLocalStorage = () => {
    try {
      const userId = localStorage.getItem('user-id');
      const userName = localStorage.getItem('user-name');
      const userDescription = localStorage.getItem('user-description');
      const userQuestionRankings = JSON.parse(localStorage.getItem('user-question-rankings'));
      const userMatches = JSON.parse(localStorage.getItem('user-matches'));
      const roomCode = localStorage.getItem('room-code');
      const roomName = localStorage.getItem('room-name');
      this.setState(
        {
          userId,
          userName,
          userDescription,
          userQuestionRankings,
          userMatches,
          roomCode,
          roomName,
        },
        () => console.log('Hydrated data from local storage.', this.state)
      );

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

  saveUserRoom = (userName, userDescription, roomCode, roomName) => {
    try {
      localStorage.setItem('user-name', userName);
      localStorage.setItem('user-description', userDescription);
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

  saveUserMatches = matches => {
    try {
      localStorage.setItem('user-matches', JSON.stringify(matches));
    } catch (error) {
      console.log('Local storage saving error: ', error);
    }
  };

  onConnectSocket = () => {
    console.log('Socket connected on the front-end.');

    const { roomCode, userId } = this.state;
    if (roomCode && userId) {
      socket.emit('rejoin_room', { roomCode, userId });
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
      localStorage.removeItem('user-description');
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
    this.setState({ userName, userDescription, roomCode, roomName });
    this.saveUserRoom(userName, userDescription, roomCode, roomName);

    if (userQuestionRankings) {
      this.navigate(PAGES.Room);
      socket.emit('update_question_rankings', {
        userId,
        userQuestionRankings,
        roomCode,
      });
    } else {
      this.navigate(PAGES.QuestionRanker);
    }
  };

  onRetakeQuestionRanker = () => {
    this.navigate(PAGES.QuestionRanker, true);
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
      case PAGES.Room:
        this.navigate(PAGES.Home, true);
        break;
      case PAGES.MatchedUser:
        this.navigate(PAGES.Room, true);
        break;
      default:
        break;
    }
  };

  onRankAllQuestions = questionRankings => {
    const { userId, roomCode } = this.state;
    this.setState({ userQuestionRankings: questionRankings });
    this.saveUserQuestionRankings(questionRankings);
    socket.emit('update_question_rankings', {
      userId,
      userQuestionRankings: questionRankings,
      roomCode,
    });
  };

  onEnterRoom = () => {
    this.navigate(PAGES.Room);
  };

  onUpdateMatches = ({ users, matches }) => {
    const { userId } = this.state;
    console.log('Receiving matches', matches, 'with users', users);

    const currentUserMatches = {};
    for (let matchId in matches) {
      if (!matchId.includes(userId)) {
        continue;
      }
      const otherUserId = matchId.replace(userId, '');
      currentUserMatches[otherUserId] = {
        ...users[otherUserId],
        ...matches[matchId],
      };
    }

    this.setState({ userMatches: currentUserMatches });
    this.saveUserMatches(currentUserMatches);
  };

  onExamineUser = match => {
    this.navigate(PAGES.MatchedUser, match);
  };

  navigate = (page, goingBack = false) => {
    this.setState({ navigating: true, navigatedBack: goingBack });
    setTimeout(() => {
      window.scrollTo(0, 0);
      this.setState({ page, navigating: false, navigatedBack: false });
    }, 500);
  };

  render() {
    const {
      page,
      userName,
      userDescription,
      userMatches,
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
            userDescriptionHint={userDescription}
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
      case PAGES.Room:
        component = (
          <RoomScreen
            matches={userMatches}
            onExamineUser={this.onExamineUser}
            onRetakeQuestionRanker={this.onRetakeQuestionRanker}
          />
        );
        break;
      case PAGES.MatchedUser:
        component = <MatchedUserScreen />;
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
