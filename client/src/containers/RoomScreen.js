import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Spinner } from 'react-bootstrap';
import FlipMove from 'react-flip-move';
import { TiChevronRightOutline } from 'react-icons/ti';
import colors from '../lib/colors';

const RoomScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const List = styled(FlipMove)`
  width: 100%;
`;

const ListRow = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: black;
  margin-bottom: 10px;
  background-color: ${({ highlight }) => (highlight === true ? colors.pop : 'white')};
`;

const ListText = styled.div`
  line-height: 1;
  font-size: 18px;
`;

export default class RoomScreen extends Component {
  renderMatch = (match, index) => {
    const { onExamineUser } = this.props;
    return (
      <ListRow key={match.userId} onClick={() => onExamineUser(match)} highlight={index < 3}>
        <ListText>{match.userName}</ListText>
        <ListText>
          {`${(match.matchPercentage * 100).toFixed(0)}%`}
          <TiChevronRightOutline size="25px" style={{ marginLeft: '5px' }} />
        </ListText>
      </ListRow>
    );
  };

  render() {
    const { matches, onRetakeQuestionRanker } = this.props;

    let body;
    if (matches) {
      const matchesArray = Object.values(matches);
      if (matchesArray.length > 0) {
        const sortedMatches = matchesArray.sort(
          (match1, match2) => match2.matchPercentage - match1.matchPercentage
        );
        body = (
          <>
            <List>{sortedMatches.map(this.renderMatch)}</List>
          </>
        );
      } else {
        body = <h4>{"You're the only one here!"}</h4>;
      }
    } else {
      body = <Spinner animation="border" size="lg" variant="primary" />;
    }

    return (
      <RoomScreenContainer>
        {body}
        <Button onClick={onRetakeQuestionRanker} style={{ marginTop: '20px' }}>
          {'Re-rank questions!'}
        </Button>
      </RoomScreenContainer>
    );
  }
}
