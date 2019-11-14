import React, { Component } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
// import { ScrollView, StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
// import { Button, Text, ListItem, Icon } from 'react-native-elements';
// import Swiper from 'react-native-deck-swiper';
import { Button } from 'react-bootstrap';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { GiStarFormation, GiShrug } from 'react-icons/gi';

import QUESTIONS, { ORDERED_QUESTIONS } from '../lib/questions';
import colors from '../lib/colors';
// import SAMPLE_MATCHES from '../constants/matches';
// import SAMPLE_USERS from '../constants/users';
// import { add_user, add_room } from '../Firestore';

const QuestionRankerScreenContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardBody = styled.div`
  .questionRankerCard-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  .questionRankerCard-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity 500ms, transform 500ms;
  }
  .questionRankerCard-exit {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
  .questionRankerCard-exit-active {
    opacity: 0;
    ${({ direction }) => {
      switch (direction) {
        case 'like': {
          return 'transform: translateX(100px);';
        }
        case 'dislike': {
          return 'transform: translateX(-100px);';
        }
        case 'superlike': {
          return 'transform: translateY(-100px);';
        }
        case 'indifferent': {
          return 'transform: translateY(100px);';
        }
      }
    }}}
    transition: opacity 500ms, transform 500ms;
  }
`;

const CardContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background-color: white;
  padding: 20px;
  max-height: 60vh;
  margin-bottom: 30px;
  ${({ center }) => (center === true ? 'justify-content: center;' : '')}
`;

const CardText = styled.div`
  text-align: center;
  font-size: 24px;
  color: black;
`;

const CardImage = styled.img`
  width: auto;
  height: 100%;
  max-height: 200px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonsRowContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const ButtonContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default class QuestionRankerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionRankings: {},
      inProgressQuestionRankings: {},
      cardIndex: 0,
      lastRank: 'like',
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

    if (newCardIndex === ORDERED_QUESTIONS.length) {
      // Done!
      this.setState({
        questionRankings: updatedInProgressQuestionRankings,
        inProgressQuestionRankings: {},
        cardIndex: newCardIndex,
      });
      onRankAll(updatedInProgressQuestionRankings);
    } else if (newCardIndex < ORDERED_QUESTIONS.length) {
      // Some more left to go!
      this.setState({
        cardIndex: newCardIndex,
        inProgressQuestionRankings: updatedInProgressQuestionRankings,
        lastRank: ranking,
      });
    }
  };

  renderCard = (questionId, index) => {
    const { cardIndex } = this.state;
    const currentQuestion = QUESTIONS[questionId];
    const { prompt, image } = currentQuestion;
    return (
      <CSSTransition in={index === cardIndex} timeout={500} classNames="questionRankerCard">
        <CardContainer visible={index === cardIndex}>
          <CardImage src={require(`../assets/${image}.png`)} />
          <CardText>{prompt}</CardText>
        </CardContainer>
      </CSSTransition>
    );
  };

  render() {
    const { cardIndex, lastRank } = this.state;

    let cardBody;
    if (cardIndex === ORDERED_QUESTIONS.length) {
      cardBody = (
        <CSSTransition in={true} timeout={500} classNames="questionRankerCard">
          <CardContainer>
            <CardText center>{"You're done!"}</CardText>
          </CardContainer>
        </CSSTransition>
      );
    } else {
      cardBody = ORDERED_QUESTIONS.map(this.renderCard);
    }

    return (
      <QuestionRankerScreenContainer>
        <CardBody lastRank={lastRank}>{cardBody}</CardBody>
        <ButtonsContainer>
          <ButtonsRowContainer>
            <ButtonContainer onClick={() => this.onRank('superlike')}>
              <GiStarFormation size="35px" color={colors.superlike} />
            </ButtonContainer>
          </ButtonsRowContainer>
          <ButtonsRowContainer>
            <ButtonContainer onClick={() => this.onRank('dislike')}>
              <GoThumbsdown size="35px" color={colors.dislike} />
            </ButtonContainer>
            <ButtonContainer onClick={() => this.onRank('like')}>
              <GoThumbsup size="35px" color={colors.like} />
            </ButtonContainer>
          </ButtonsRowContainer>
          <ButtonsRowContainer>
            <ButtonContainer onClick={() => this.onRank('indifferent')}>
              <GiShrug size="35px" color={colors.indifferent} />
            </ButtonContainer>
          </ButtonsRowContainer>
        </ButtonsContainer>
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
