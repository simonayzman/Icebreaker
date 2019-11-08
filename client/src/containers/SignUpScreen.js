import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  TextInput,
} from 'react-native';
import {
  Header,
  Button,
  Overlay,
  Input,
  Divider,
  Icon,
} from 'react-native-elements';

import { get_user, get_room } from '../Firestore';

export default class SignUpScreen extends Component {
  constructor() {
    super();
    this.state = {
      roomCode: '',
      roomName: '',
      codeName: '',
      description: '',
      error: false,
      errorCodeName: null,
      errorRoomCode: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const roomSelectState = navigation.getParam('roomState', 'join');
    if (roomSelectState === 'create') {
      this.setState({ roomCode: this.generateRoomCode() });
    }
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

  onPressEnterCardSwipe = () => {
    const { roomCode, codeName, errorRoomCode, errorCodeName } = this.state;
    console.log(`Joining room code: ${roomCode}`);

    if (roomCode && codeName && !errorRoomCode && !errorCodeName) {
      this._addUser(roomCode);
    } else if (!roomCode) {
      return this.setState({ errorRoomCode: true });
    } else if (!codeName) {
      return this.setState({ errorCodeName: true });
    }
  };

  generateUserId = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  _addUser = async (roomId) => {
    const userId = await AsyncStorage.getItem('user-id') || this.generateUserId(10);
    const { description, codeName, roomName } = this.state;
    const { questionList } = this.props.navigation.state.params;
    const roomState = this.props.navigation.getParam('roomState', 'join');

    console.log("FROM SUIGN UP: ", description, codeName, questionList)

    get_user(roomId, userId, (data) => {
      data && data.userId == userId ?
        this.props.navigation.replace("Room", {
          roomId,
          userId,
          roomState,
          roomName
        })
        :
        this.props.navigation.replace("CardSwipe", {
          roomId,
          userId,
          description,
          codeName,
          questionList,
          roomState,
          roomName
        });
    });
  }

  onChangeRoomCode = roomCode => {
    const roomId = roomCode.trim().toUpperCase();
    console.log(`Typing room code: ${roomId}`);
    this.setState({ roomCode: roomId });

    if (roomCode.length > 5) this._checkRoom(roomId);
  };

  _checkRoom = async roomId => {
    await get_room(roomId, data => {
      console.log('Found room: ', data);
      data && data.roomId == roomId
        ? this.setState({ errorRoomCode: false })
        : this.setState({ errorRoomCode: true });
    });
  };

  onChangeRoomName = roomName => {
    this.setState({ roomName });
  };

  onChangeCodeName = codeName => {
    this.setState({ codeName, errorCodeName: false });
  };

  onChangeDescription = description => {
    this.setState({ description });
  };

  onClearRoomName = () => {
    console.log(`Clearing room name`);
    this.setState({ roomName: '' });
  };

  onClearRoomCode = () => {
    console.log(`Clearing room code`);
    this.setState({ roomCode: '' });
  };

  onClearCodeName = () => {
    console.log(`Clearing room code`);
    this.setState({ codeName: '' });
  };

  render() {
    const { navigation } = this.props;
    const { roomCode, errorCodeName, errorRoomCode } = this.state;
    const roomSelectState = navigation.getParam('roomState', 'join');

    let roomNameElement;
    let roomCodeElement;
    if (roomSelectState === 'join') {
      roomNameElement = null;
      roomCodeElement = (
        <Input
          autoCorrect={false}
          autoCapitalize="characters"
          maxLength={6}
          containerStyle={{ padding: 0 }}
          style={{ padding: 0 }}
          placeholder="Enter 6-letter event code"
          value={this.state.roomCode}
          onChangeText={this.onChangeRoomCode}
          errorMessage={errorRoomCode ? "Room doesn't exist!" : null}
          rightIcon={
            <Icon
              name="clear"
              size={24}
              color="black"
              onPress={this.onClearRoomCode}
            />
          }
        />
      );
    } else if (roomSelectState === 'create') {
      roomNameElement = (
        <View style={styles.textInputContainer}>
          <Text>{'Room Name'}</Text>
          <Input
            containerStyle={{ padding: 0 }}
            style={{ padding: 0 }}
            placeholder="(optional)"
            value={this.state.roomName}
            onChangeText={this.onChangeRoomName}
            rightIcon={
              <Icon
                name="clear"
                size={24}
                color="black"
                onPress={this.onClearRoomName}
              />
            }
          />
        </View>
      );
      roomCodeElement = (
        <Text style={styles.generatedRoomCodeText}>{roomCode}</Text>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.textInputContainer}>
            <Text>Room Code</Text>
            {roomCodeElement}
          </View>
          {roomNameElement}
          <View style={styles.textInputContainer}>
            <Text>Your "Code Name"</Text>
            <Input
              autoCorrect={false}
              placeholder="e.g., Superman999"
              value={this.state.codeName}
              onChangeText={this.onChangeCodeName}
              errorMessage={errorCodeName ? 'Please enter a nickname!' : null}
              style={{ marginLeft: 0 }}
              rightIcon={
                <Icon
                  name="clear"
                  size={24}
                  color="black"
                  onPress={this.onClearCodeName}
                />
              }
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text>What do you look like?</Text>
            <TextInput
              onChangeText={this.onChangeDescription}
              value={this.state.description}
              multiline
              placeholder={"I'm the coolest looking person in the room"}
              style={{
                height: 200,
                marginTop: 10,
                borderRadius: 5,
                borderColor: 'grey',
                borderWidth: 1,
                padding: 15,
                paddingTop: 10,
              }}
            />
          </View>
        </ScrollView>
        <Button
          style={styles.joinButton}
          onPress={this.onPressEnterCardSwipe}
          title="Start meeting new people!"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {},
  joinButton: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
  },
  textInputContainer: {
    marginTop: 30,
  },
  textInput: {},
  generatedRoomCodeText: {
    paddingLeft: 8,
    paddingTop: 5,
    fontSize: 16,
    color: 'gray',
  },
});
