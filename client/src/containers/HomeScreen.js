import React, { Component, Fragment } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import {
  Header,
  Button,
  Overlay,
  Input,
  Divider,
  Icon,
} from 'react-native-elements';
import logoAsset from '../assets/logo.jpg';
import { get_question_list } from '../Firestore';


export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
      userId: null,
      questionList: {}
    };
  }

  componentDidMount() {
    this.hydrateUserId();
    this.getQuestions();
  }


  generateUserId = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  hydrateUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('user-id') || this.generateUserId(10);
      if (value !== null) {
        console.log('Hydrating user id: ', value);
        this.setState({ userId: value });
      } else {
        const newId = this.generateUserId(10);
        console.log('Setting new user id: ', newId);
        await AsyncStorage.setItem('user-id', newId);
        this.setState({ userId: newId });
      }
    } catch (error) {
      console.log('AsyncStorage error: ', error);
    }
  };

  getQuestions = () => {
    get_question_list("list_1", (data) => {
      this.setState({
        questionList: data
      })
    })
  }

  onPressCreateRoom = () => {
    const { navigation } = this.props;
    const { userId, questionList } = this.state;
    console.log('Creating room!');
    navigation.navigate('SignUp', { userId, roomState: 'create', questionList });
  };

  onPressJoinRoom = (questionList) => {
    const { navigation } = this.props;
    const { userId } = this.state;

    navigation.navigate('SignUp', { userId, questionList: questionList, roomState: 'join' });
    console.log(`Joining room!`);

    // setTimeout(() => {
    //   const random = Math.floor(Math.random() * 2);
    //   if (random % 2 == 0) {
    //     navigation.navigate('Room', { roomCode, userId });
    //   } else {
    //     this.setState({ error: true });
    //   }
    // }, 500);
  };

  // onChangeRoomCode = roomCode => {
  //   console.log(`Typing room code: ${roomCode}`);
  //   this.setState({ roomCode: roomCode.trim().toUpperCase() });
  // };

  onClearRoomCode = () => {
    console.log(`Clearing room code`);
    this.setState({ roomCode: '' });
  };

  render() {
    const { error } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 30,
            }}
          >
            <ImageBackground
              style={{
                height: 'auto',
                width: 300,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}
              source={logoAsset}
              resizeMode="contain"
            >
              <Text style={styles.logoText}>{'Icebreaker'}</Text>
            </ImageBackground>
            <Text style={styles.logoSubtitle}>
              {'The easy way to break the ice\nand make better connections'}
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={{ alignItems: 'center' }}>
              <Button
                containerStyle={styles.buttonContainer}
                onPress={this.onPressCreateRoom}
                title="Create Room"
              />
              <Text style={styles.buttonSubtitle}>
                {"Let's get this party started"}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Button
                containerStyle={styles.buttonContainer}
                onPress={() => this.onPressJoinRoom(this.state.questionList)}
                title="Join Room"
              />
              <Text style={styles.buttonSubtitle}>
                {'Join the party and meet people'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 4,
  },
  logoText: {
    color: 'orange',
    fontFamily: 'AppleSDGothicNeo-Bold',
    fontSize: 24,
    textAlign: 'center',
  },
  logoSubtitle: {
    color: '#0288D1',
    fontFamily: 'AppleSDGothicNeo-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonSubtitle: {
    color: 'rgb(109, 114, 120)',
    fontFamily: 'AppleSDGothicNeo-Light',
    fontSize: 16,
  },
});
