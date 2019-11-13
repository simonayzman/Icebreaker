import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import colors from '../lib/colors';
import { API } from '../lib/config';

const StyledForm = styled(Form)`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FieldContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const FieldLabel = styled.div`
  font-size: 20px;
  color: ${colors.label};
  text-align: left;
`;

const StyledField = styled(Field)`
  width: 100%;
  font-size: 20px;
  padding: 5px 10px;

  :disabled {
    color: #aaa;
  }
`;

const StyledErrorMessage = styled.div`
  color: red;
  text-align: left;
  font-size: 20px;
`;

const SubmitButton = styled(Button)`
  margin-top: 20px;
`;

export default class RoomIntroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generatedRoomCode: props.roomSelection === 'create' ? this.generateRoomCode() : '',
    };
  }

  generateRoomCode = (length = 6) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  onSubmitRoomDetails = async (values, formik) => {
    const { roomSelection, onJoinRoom } = this.props;
    const { roomCode, roomName, userName, userDescription } = values;
    console.log(`Joining room code: ${roomCode}`);

    if (roomSelection === 'create') {
      const createUrl = encodeURI(`${API}/createRoom?roomCode=${roomCode}&roomName=${roomName}`);
      const response = await fetch(createUrl);
      const responseJson = await response.json();
      const { error } = responseJson;
      if (error === true) {
        formik.setFieldError('roomCode', 'Room already exists! Refresh page.');
      } else {
        onJoinRoom({ roomCode, roomName }, { userName, userDescription });
      }
    } else if (roomSelection === 'join') {
      const checkUrl = encodeURI(`${API}/checkRoom?roomCode=${roomCode}`);
      const response = await fetch(checkUrl);
      const responseJson = await response.json();
      const { error, meta } = responseJson;
      if (error === true) {
        formik.setFieldError('roomCode', 'Room code does not exist!');
      } else {
        const { roomName } = meta;
        onJoinRoom({ roomCode, roomName }, { userName, userDescription });
      }
    }
  };

  /*
  _addUser = async roomId => {
    const userId = (await AsyncStorage.getItem('user-id')) || this.generateUserId(10);
    const { description, codeName, roomName } = this.state;
    const { questionList } = this.props.navigation.state.params;
    const roomState = this.props.navigation.getParam('roomState', 'join');

    console.log('FROM SUIGN UP: ', description, codeName, questionList);

    get_user(roomId, userId, data => {
      data && data.userId == userId
        ? this.props.navigation.replace('Room', {
            roomId,
            userId,
            roomState,
            roomName,
          })
        : this.props.navigation.replace('CardSwipe', {
            roomId,
            userId,
            description,
            codeName,
            questionList,
            roomState,
            roomName,
          });
    });
  };

  _checkRoom = async roomId => {
    await get_room(roomId, data => {
      console.log('Found room: ', data);
      data && data.roomId == roomId
        ? this.setState({ errorRoomCode: false })
        : this.setState({ errorRoomCode: true });
    });
  };

  */

  render() {
    const { userNameHint, roomCodeHint, roomSelection } = this.props;
    const { generatedRoomCode } = this.state;

    let roomNameInput = null;
    if (roomSelection === 'create') {
      roomNameInput = (
        <FieldContainer>
          <FieldLabel htmlFor="roomName">{'Room Name'}</FieldLabel>
          <StyledField name="roomName" type="text" placeholder="(optional)" />
          <ErrorMessage
            name="roomName"
            render={msg => <StyledErrorMessage>{msg}</StyledErrorMessage>}
          />
        </FieldContainer>
      );
    }

    return (
      <Formik
        initialValues={{
          roomCode:
            roomSelection === 'create'
              ? generatedRoomCode
              : roomCodeHint == null
              ? ''
              : roomCodeHint,
          roomName: '',
          userName: userNameHint == null ? '' : userNameHint,
          userDescription: '',
        }}
        validationSchema={Yup.object({
          roomCode: Yup.string()
            .min(6, 'Must be 6 characters')
            .max(6, 'Must be 6 characters')
            .required('*Required'),
          userName: Yup.string().required('*Required'),
          userDescription: Yup.string().required('*Required'),
        })}
        onSubmit={this.onSubmitRoomDetails}
      >
        {({ setFieldValue }) => (
          <StyledForm>
            <FieldContainer>
              <FieldLabel htmlFor="roomCode">{`Room Code${
                roomSelection === 'create' ? ' (autogenerated)' : ''
              }`}</FieldLabel>
              <StyledField
                name="roomCode"
                type="text"
                autoCorrect="off"
                autoCapitalize="characters"
                maxLength={6}
                placeholder="Enter 6-letter event code"
                onChange={event => setFieldValue('roomCode', event.target.value.toUpperCase())}
                disabled={roomSelection === 'create'}
              />
              <ErrorMessage
                name="roomCode"
                render={msg => <StyledErrorMessage>{msg}</StyledErrorMessage>}
              />
            </FieldContainer>
            {roomNameInput}
            <FieldContainer>
              <FieldLabel htmlFor="userName">Your Name</FieldLabel>
              <StyledField name="userName" autoCorrect="off" />
              <ErrorMessage
                name="userName"
                render={msg => <StyledErrorMessage>{msg}</StyledErrorMessage>}
              />
            </FieldContainer>
            <FieldContainer>
              <FieldLabel htmlFor="userDescription">What do you look like?</FieldLabel>
              <StyledField
                name="userDescription"
                component="textarea"
                autoCorrect="off"
                rows={3}
                placeholder={'e.g., Blonde. Wearing red fedora. Sizeable front teeth.'}
              />
              <ErrorMessage
                name="userDescription"
                render={msg => <StyledErrorMessage>{msg}</StyledErrorMessage>}
              />
            </FieldContainer>
            <SubmitButton variant="primary" size="lg" type="submit" block>
              {"Let's do this!"}
            </SubmitButton>
          </StyledForm>
        )}
      </Formik>
    );
  }
}
