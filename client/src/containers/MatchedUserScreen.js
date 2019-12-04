import React, { Component } from 'react';
import styled from 'styled-components';

import QUESTIONS from '../lib/questions';
import colors from '../lib/colors';

const MatchedUserScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ListRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  color: black;
  margin-bottom: 15px;
  background-color: white;
`;

const CommonQuestionText = styled.h5`
  color: ${colors.pop};
`;

const PromptText = styled.div`
  line-height: 1;
  font-size: 18px;
`;

export default class MatchedUserScreen extends Component {
  renderQuestion = questionId => {
    const question = QUESTIONS[questionId];
    return (
      <ListRow key={questionId}>
        <PromptText>{question.prompt}</PromptText>
      </ListRow>
    );
  };

  render() {
    const {
      match: { userName, userDescription, commonQuestions },
    } = this.props;

    return (
      <MatchedUserScreenContainer>
        <h2>{userName}</h2>
        <h5>{userDescription}</h5>
        <br />
        <CommonQuestionText>{'Strike up a conversation!'}</CommonQuestionText>
        {commonQuestions.map(this.renderQuestion)}
      </MatchedUserScreenContainer>
    );
  }
}
