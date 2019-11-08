import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import logoAsset from '../assets/iceberg3.png';

const HomeScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: '#fff';
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
  color: orange;
  font-family: AppleSDGothicNeo-Bold;
  font-size: 28px;
  text-align: center;
  text-shadow: 2px 2px 4px #000000;
`;

const LogoSubtitle = styled.div`
  color: #0288d1;
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
  color: rgb(109, 114, 120);
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
          <LogoSubtitle>{'The easy way to break the ice'}</LogoSubtitle>
          <LogoSubtitle>{'and make better connections'}</LogoSubtitle>
        </LogoContainer>
        <ButtonsContainer>
          <ButtonContainer>
            <Button block variant="primary" size="lg" onClick={this.props.onStartCreateRoom}>
              {'Create Room'}
            </Button>
            <ButtonSubtitle>{"Let's get this party started"}</ButtonSubtitle>
          </ButtonContainer>{' '}
          <ButtonContainer>
            <Button block variant="primary" size="lg" onClick={this.props.onStartJoinRoom}>
              {'Join Room'}
            </Button>
            <ButtonSubtitle>{'Join the party and meet people'}</ButtonSubtitle>
          </ButtonContainer>{' '}
        </ButtonsContainer>
      </HomeScreenContainer>
    );
  }
}

const styles = {
  buttonSubtitle: {},
};
