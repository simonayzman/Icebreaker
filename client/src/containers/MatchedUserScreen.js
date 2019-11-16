import React, { Component } from 'react';
import styled from 'styled-components';

import QUESTIONS from '../lib/questions';

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
  justify-content: space-between;
  padding: 10px;
  color: black;
  margin-bottom: 10px;
  background-color: white;
`;

export default class MatchedUserScreen extends Component {
  renderQuestion = questionId => {
    const question = QUESTIONS[questionId];
    return (
      <ListRow key={questionId}>
        <div>{question.prompt}</div>
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
        <h4>{userDescription}</h4>
        <br />
        <h5>{'Strike up a conversation!'}</h5>
        {commonQuestions.map(this.renderQuestion)}
      </MatchedUserScreenContainer>
    );
  }
}
