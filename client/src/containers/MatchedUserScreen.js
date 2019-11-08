import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Button, Text, ListItem, Icon } from 'react-native-elements';
import Swiper from 'react-native-deck-swiper';
import Modal from 'react-native-modal';

import SAMPLE_QUESTIONS from '../constants/questions';
import SAMPLE_MATCHES from '../constants/matches';
import SAMPLE_USERS from '../constants/users';
import { TouchableOpacity } from 'react-native-gesture-handler';

const TOTAL_NUM_OF_QUESTIONS = Object.keys(SAMPLE_QUESTIONS).length;

const checkMarkIcon = require('../assets/checkCircle3.png');

const numColumns = 3;
const size = (Dimensions.get('window').width - 50) / numColumns;
export default class MatchedUserScreen extends Component {
  constructor(props) {
    super(props);
    this.user = Object.values(props.navigation.state.params)[0];
    const keys = Object.keys(this.user.questionRankings);
    this.state = {
      matchedQuestions: Object.keys(this.user.questionRankings),
      questionRankings: {},
      inProgressQuestionRankings: {},
    };
  }

  componentDidMount() {}

  renderQuestion = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={checkMarkIcon}
          style={{ position: 'absolute', top: 5, right: 5, zIndex: 5 }}
        />
        {this.matchQuestionTypeToImage(item) ? (
          <Image source={this.matchQuestionTypeToImage(item)} />
        ) : (
          <Icon name="rowing" />
        )}
      </View>
    );
  };

  matchQuestionTypeToImage = questionRankings => {
    switch (questionRankings) {
      case 'q1':
        return require('../assets/music.png');
      case 'q2':
        return require('../assets/politics.png');
      case 'q3':
        return require('../assets/foodIcon.png');
      case 'q4':
        return require('../assets/tv.png');
      case 'q5':
        return require('../assets/coding.png');
      default:
        return undefined;
    }
  };

  render() {
    const { navigation } = this.props;
    const { matchedQuestions, questions } = this.state;

    const numOfCommonQuestions = Object.values(this.state.matchedQuestions)
      .length;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <Text>Your shared interest with {this.user.codename}</Text>
            <Text style={styles.description}>{this.user.description}</Text>
          </View>
          <View style={styles.agreeTextContainer}>
            <Text
              style={styles.agreeText}
            >{`You have alot in common with ${this.user.codename}!`}</Text>
            <Text
              style={[styles.agreeText, { marginTop: 10 }]}
            >{`You agree on ${numOfCommonQuestions}/${TOTAL_NUM_OF_QUESTIONS}!`}</Text>
          </View>
          <FlatList
            numColumns={2}
            data={this.state.matchedQuestions}
            renderItem={this.renderQuestion}
            keyExtractor={item => item}
          />
        </ScrollView>
        <View style={styles.introduceButtonContainer}>
          <TouchableOpacity style={styles.button}>
            <Image
              source={require('../assets/message.png')}
              style={{ position: 'absolute', left: 10, tintColor: '#fff' }}
            />
            <Text style={styles.introduceText}>Introduce Yourself</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  flatlistContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  description: {
    borderWidth: 1,
    borderColor: 'rgb(151, 151, 151)',
    backgroundColor: 'rgb(216, 216, 216)',
    height: 40,
    marginTop: 10,
  },
  text: {
    textAlign: 'left',
    fontSize: 32,
    backgroundColor: 'transparent',
  },
  itemContainer: {
    width: size,
    height: size,
    margin: 10,
    borderColor: 'rgb(0, 145, 255)',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    margin: 3,
    backgroundColor: 'lightblue',
  },
  titleText: {
    fontSize: 18,
  },
  agreeText: {
    fontSize: 15,
    textAlign: 'center',
    color: 'rgb(53, 64, 82)',
  },
  agreeTextContainer: {
    marginTop: 35,
  },
  button: {
    borderRadius: 5,
    height: 30,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(0, 145, 255)',
  },
  introduceButtonContainer: {
    color: '#fff',
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introduceText: {
    color: '#fff',
  },
});
