import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import colors from '../lib/colors';

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
      roomName: '',
      codeName: '',
      description: '',
      error: false,
      errorCodeName: null,
      errorRoomCode: null,
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

  onSubmitRoomDetails = () => {
    // this.props.onSubmitRoomDetails();
    const { roomCode, codeName, errorRoomCode, errorCodeName } = this.state;
    console.log(`Joining room code: ${roomCode}`);
    return;

    if (roomCode && codeName && !errorRoomCode && !errorCodeName) {
      this._addUser(roomCode);
    } else if (!roomCode) {
      return this.setState({ errorRoomCode: true });
    } else if (!codeName) {
      return this.setState({ errorCodeName: true });
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
    const { userId, roomSelection } = this.props;
    const { generatedRoomCode, roomCode, errorCodeName, errorRoomCode } = this.state;

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
          roomCode: roomSelection === 'create' ? generatedRoomCode : '',
          roomName: '',
          name: '',
          description: '',
        }}
        validationSchema={Yup.object({
          roomCode: Yup.string()
            .min(6, 'Must be 6 characters')
            .max(6, 'Must be 6 characters')
            .required('*Required'),
          name: Yup.string().required('*Required'),
          description: Yup.string().required('*Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          this.onSubmitRoomDetails();
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 400);
        }}
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
              <FieldLabel htmlFor="name">Your Name</FieldLabel>
              <StyledField name="name" autoCorrect="off" />
              <ErrorMessage
                name="name"
                render={msg => <StyledErrorMessage>{msg}</StyledErrorMessage>}
              />
            </FieldContainer>
            <FieldContainer>
              <FieldLabel htmlFor="description">What do you look like?</FieldLabel>
              <StyledField
                name="description"
                component="textarea"
                autoCorrect="off"
                rows={3}
                placeholder={'e.g., Blonde. Wearing red fedora. Sizeable front teeth.'}
              />
              <ErrorMessage
                name="description"
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
