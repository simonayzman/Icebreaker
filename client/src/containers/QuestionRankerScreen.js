import React, { Component } from 'react';
import styled from 'styled-components';
// import { ScrollView, StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
// import { Button, Text, ListItem, Icon } from 'react-native-elements';
// import Swiper from 'react-native-deck-swiper';
import { Button } from 'react-bootstrap';

import QUESTIONS, { ORDERED_QUESTIONS } from '../lib/questions';
// import SAMPLE_MATCHES from '../constants/matches';
// import SAMPLE_USERS from '../constants/users';
// import { add_user, add_room } from '../Firestore';

const QuestionRankerScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export default class QuestionRankerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionRankings: {},
      inProgressQuestionRankings: {},
      cardIndex: 0,
    };
  }

  onRank = ranking => {
    const { onRankAll } = this.props;
    const { inProgressQuestionRankings, cardIndex } = this.state;
    const currentQuestionId = ORDERED_QUESTIONS[cardIndex];
    const newCardIndex = cardIndex + 1;
    const updatedInProgressQuestionRankings = {
      ...inProgressQuestionRankings,
      [currentQuestionId]: ranking,
    };

    if (newCardIndex === Object.keys(QUESTIONS).length) {
      // Done!
      this.setState({
        questionRankings: updatedInProgressQuestionRankings,
        inProgressQuestionRankings: {},
        cardIndex: newCardIndex,
      });
      onRankAll(updatedInProgressQuestionRankings);
    } else {
      // Some more left to go!
      this.setState({
        cardIndex: newCardIndex,
        inProgressQuestionRankings: updatedInProgressQuestionRankings,
      });
    }
  };

  renderCard = cardIndex => {
    if (cardIndex === ORDERED_QUESTIONS.length) {
      return (
        <div style={styles.card}>
          <div style={styles.text}>{"You're done!"}</div>
        </div>
      );
    }

    const currentQuestionId = ORDERED_QUESTIONS[cardIndex];
    const currentQuestion = QUESTIONS[currentQuestionId];
    const { prompt, image } = currentQuestion;
    return (
      <div style={styles.card}>
        <img src={require(`../assets/${image}.png`)} style={{ width: '100%', height: 'auto' }} />
        <div style={styles.text}>{prompt}</div>
      </div>
    );
  };

  render() {
    const { cardIndex } = this.state;
    return (
      <QuestionRankerScreenContainer>
        <>{this.renderCard(cardIndex)}</>
        <>
          <Button onClick={() => this.onRank('dislike')}>{'NO'}</Button>
          <Button onClick={() => this.onRank('indifferent')}>{'EH'}</Button>
          <Button onClick={() => this.onRank('like')}>{'YES'}</Button>
          <Button onClick={() => this.onRank('superlike')}>{'OH YES!'}</Button>
        </>
        {/* {this.state.numOfQuestionsLeft > 0 && (
          <View style={{ alignItems: 'center' }}>
            <Text>Number of Questions Left</Text>
            <Text>{`${this.state.numOfQuestionsLeft} / ${numOfQuestions}`}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          {this.state.finishedQuestions ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>You're done with all your questions</Text>
              <TouchableOpacity style={styles.joinButton} onPress={this.enterRoomScreen}>
                <Text style={{ color: '#fff' }}>Join Room</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Swiper
              cardIndex={0}
              stackSize={3}
              useViewOverflow={false}
              verticalSwipe={false}
              cards={orderedQuestions}
              renderCard={this.renderCard}
              onSwipedLeft={cardIndex => this.onSwipe(cardIndex, 'dislike')}
              onSwipedRight={cardIndex => this.onSwipe(cardIndex, 'like')}
              onSwipedAll={this.onSwipedAll}
              cardHorizontalMargin={0}
              backgroundColor={'#F5FCFF'}
            />
          )}
        </View> */}
      </QuestionRankerScreenContainer>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  card: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
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
    color: 'black',
  },
  joinButton: {
    marginTop: 25,
    alignSelf: 'stretch',
    marginLeft: 25,
    marginRight: 25,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
};
