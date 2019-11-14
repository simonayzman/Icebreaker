import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { Swipeable } from 'react-swipeable';
import { Button } from 'react-bootstrap';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { GiStarFormation, GiShrug } from 'react-icons/gi';

import QUESTIONS, { ORDERED_QUESTIONS } from '../lib/questions';
import colors from '../lib/colors';

const QuestionRankerScreenContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardBody = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
`;

const CardContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  background-color: white;
  padding: 20px;
  max-height: 60vh;
  margin-bottom: 30px;
  ${({ center }) => (center === true ? 'justify-content: center;' : '')}
  ${({ visible }) =>
    visible === true
      ? `
          transition: opacity 500ms;
          opacity: 1;
          transform: translateX(0) translateY(0);
        `
      : css`
          transition: opacity 500ms, transform 500ms;
          opacity: 0;
          ${props => {
            const { lastRanking } = props;
            switch (lastRanking) {
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
              default: {
                return '';
              }
            }
          }}
        `}
`;

const CardText = styled.div`
  text-align: center;
  font-size: 24px;
  color: black;
  line-height: 1.15;
`;

const CardImage = styled.img`
  width: auto;
  height: 100%;
  max-height: 50%;
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
      lastRanking: 'left',
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
        lastRanking: ranking,
      });
      onRankAll(updatedInProgressQuestionRankings);
    } else if (newCardIndex < ORDERED_QUESTIONS.length) {
      // Some more left to go!
      this.setState({
        cardIndex: newCardIndex,
        inProgressQuestionRankings: updatedInProgressQuestionRankings,
        lastRanking: ranking,
      });
    }
  };

  renderCard = (questionId, index) => {
    const { cardIndex, lastRanking } = this.state;
    const currentQuestion = QUESTIONS[questionId];
    const { prompt, image } = currentQuestion;
    return (
      <Swipeable
        key={questionId}
        trackMouse
        onSwipedLeft={() => this.onRank('dislike')}
        onSwipedRight={() => this.onRank('like')}
        onSwipedUp={() => this.onRank('superlike')}
        onSwipedDown={() => this.onRank('indifferent')}
      >
        <CardContainer visible={index === cardIndex} lastRanking={lastRanking}>
          <CardImage src={require(`../assets/${image}.png`)} />
          <CardText>{prompt}</CardText>
        </CardContainer>
      </Swipeable>
    );
  };

  renderButtons = () => {
    const { onEnterRoom } = this.props;
    const { cardIndex } = this.state;

    if (cardIndex === ORDERED_QUESTIONS.length) {
      return (
        <ButtonsContainer>
          <ButtonsRowContainer>
            <Button block variant="primary" size="lg" onClick={onEnterRoom}>
              {'Enter room!'}
            </Button>
          </ButtonsRowContainer>
        </ButtonsContainer>
      );
    }

    return (
      <ButtonsContainer>
        <ButtonsRowContainer>
          <ButtonContainer onClick={() => this.onRank('superlike')}>
            <GiStarFormation size="35px" color={colors.superlike} />
          </ButtonContainer>
        </ButtonsRowContainer>
        <ButtonsRowContainer>
          <ButtonContainer onClick={() => this.onRank('dislike')}>
            <GoThumbsdown
              size="35px"
              color={colors.dislike}
              style={{ transform: 'scale(-1, 1)' }}
            />
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
    );
  };

  render() {
    const { cardIndex } = this.state;

    let cardBody;
    if (cardIndex === ORDERED_QUESTIONS.length) {
      cardBody = (
        <CardContainer visible center>
          <CardText center>{"You're done!"}</CardText>
        </CardContainer>
      );
    } else {
      cardBody = ORDERED_QUESTIONS.map(this.renderCard);
    }

    return (
      <QuestionRankerScreenContainer>
        <CardBody>{cardBody}</CardBody>
        <ButtonsContainer>{this.renderButtons()}</ButtonsContainer>
      </QuestionRankerScreenContainer>
    );
  }
}
