import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import logoAsset from '../assets/iceberg3.png';
import colors from '../lib/colors';

const HomeScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const LogoContainer = styled.div`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const LogoImage = styled.img`
  height: auto;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const LogoText = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: AppleSDGothicNeo-Bold;
  font-size: 28px;
  text-align: center;
  color: ${colors.logo};
  text-shadow: 2px 2px 4px #000000;
`;

const Tagline = styled.div`
  color: ${colors.tagline};
  font-family: AppleSDGothicNeo-Regular;
  font-size: 16px;
  text-align: center;
  line-height: 1.25;
`;

const ButtonsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-around;
  padding: 20px 0;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  align-items: center;
`;

const ButtonSubtitle = styled.div`
  color: ${colors.subtitle};
  font-family: AppleSDGothicNeo-Light;
  font-size: 16px;
`;

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = { error: false };
  }

  render() {
    const { error } = this.state;
    return (
      <HomeScreenContainer>
        <LogoContainer>
          <Logo>
            <LogoImage src={logoAsset} resizeMode="contain" />
            <LogoText>{'Icebreaker'}</LogoText>
          </Logo>
          <Tagline>{'The easy way to break the ice'}</Tagline>
          <Tagline>{'and make better connections'}</Tagline>
        </LogoContainer>
        <ButtonsContainer>
          <ButtonContainer>
            <Button block variant="primary" size="lg" onClick={this.props.onStartCreateRoom}>
              {'Create Room'}
            </Button>
            <ButtonSubtitle>{"Let's get this party started!"}</ButtonSubtitle>
          </ButtonContainer>{' '}
          <ButtonContainer>
            <Button block variant="primary" size="lg" onClick={this.props.onStartJoinRoom}>
              {'Join Room'}
            </Button>
            <ButtonSubtitle>{'Make your entrance and meet some people!'}</ButtonSubtitle>
          </ButtonContainer>{' '}
        </ButtonsContainer>
      </HomeScreenContainer>
    );
  }
}

const styles = {
  buttonSubtitle: {},
};
