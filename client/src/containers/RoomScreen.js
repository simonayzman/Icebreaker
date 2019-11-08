import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Button, Text, ListItem, Icon } from 'react-native-elements';
import Swiper from 'react-native-deck-swiper';
import Modal from 'react-native-modal';
import _ from 'lodash';

import { get_room } from '../Firestore';
import SAMPLE_ROOM from '../constants/room';
import SAMPLE_QUESTIONS from '../constants/questions';

export default class RoomScreen extends Component {
  constructor() {
    super();
    this.state = {
      room: {},
      matches: {},
    };
  }

  componentDidMount() {
    console.log(
      'Nav params is: ' + JSON.stringify(this.props.navigation.state.params)
    );
    // setTimeout(() => this.setState({ canShowModal: true }), 750);
    console.log('User id is: ' + this.props.navigation.state.params.userId);

    const { navigation } = this.props;
    console.log('Nav params is: ' + JSON.stringify(navigation.state.params));
    console.log('User id is: ' + navigation.state.params.userId);
    let userId = navigation.getParam('userId', null);
    let roomCode = navigation.getParam('roomId', null);
    // const roomRef = get_room_ref(roomCode);
    // let observer = roomRef.onSnapshot(
    //   newUsersSnapshot => {
    //     const newUsersData = newUsersSnapshot.data();
    //     this.setState({ room: newUsersData });
    //     this.calculateMatches(newUsersData);
    //     observer();
    //   },
    //   error => {
    //     console.log(`Encountered error: ${err}`);
    //   }
    // );

    this.userList = setInterval(() => {
      get_room(roomCode, data => {
        console.log(data);
        this.setState({ room: data });
        this.calculateMatches(data);
      });
    }, 5000);

  }

  componentWillUnmount() {
    clearInterval(this.userList)
  }


  calculateMatches = async newUsersData => {
    const { navigation } = this.props;
    const { users } = newUsersData;

    console.log(newUsersData);
    if (users == null) {
      return;
    }

    let userId = await AsyncStorage.getItem('user-id');
    const currentUser = users[userId];
    const currentUserLikedQuestions = _.filter(
      currentUser.questionRankings,
      questionRanking => questionRanking === 'like'
    );
    const updatedMatches = {};
    const questionsAnswered = Object.keys(currentUser.questionRankings).length;

    for (let otherUserId in users) {
      if (otherUserId === userId) {
        continue;
      }
      //   let generatedMatchId;
      //   if (otherUserId < userId) {
      //     generatedMatchId = `${otherUserId}||${userId}`;
      //   } else {
      //     generatedMatchId = `${userId}||${otherUserId}`;
      //   }
      const matchAccumulator = 0;
      const otherUser = users[otherUserId];
      const otherUserLikedQuestions = _.filter(
        currentUser.questionRankings,
        questionRanking => questionRanking === 'like'
      );
      const commonQuestions = _.intersection(
        otherUserLikedQuestions,
        currentUserLikedQuestions
      );

      for (let questionId in currentUser.questionRankings) {
        const currentUserAnswer = currentUser.questionRankings[questionId];
        const otherUserAnswer = otherUser.questionRankings[questionId];

        if (currentUserAnswer === 'like' && otherUserAnswer === 'like') {
          matchAccumulator += 1.0;
        }
      }

      const matchStrength = matchAccumulator / questionsAnswered;

      updatedMatches[otherUserId] = {
        commonQuestions: commonQuestions,
        matchStrength,
      };
    }

    console.log('New matches! ', updatedMatches);

    this.setState({ matches: updatedMatches });
  };

  onPressUser = user => {
    console.log('Press user: ', user);
    this.props.navigation.navigate('MatchedUser', {
      user: user,
    });
  };

  renderUser = ({ item: userId }) => {
    const { room } = this.state;
    if (room.users == null) {
      return null;
    }

    const { users } = room;
    const user = users[userId];
    return (
      <ListItem
        title={user.codeName || user.codename}
        subtitle={user.description}
        subtitleStyle={{ color: 'gray' }}
        leftElement={<Icon name="smiley" type="octicon" color="blue" />}
        bottomDivider
        chevron
        onPress={() => this.onPressUser(user)}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    const { room, matches } = this.state;

    if (room.users == null) {
      return (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 50 }}
        />
      );
    }

    const { users } = room;
    const allUsers = Object.keys(users);

    if (allUsers.length === 0) {
      return (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 50 }}
        />
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.container}
          data={allUsers}
          renderItem={this.renderUser}
          keyExtractor={item => item}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#F5FCFF',
  },
  card: {
    flex: 1,
    width: '90%',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  text: {
    textAlign: 'left',
    fontSize: 32,
    backgroundColor: 'transparent',
  },
});
