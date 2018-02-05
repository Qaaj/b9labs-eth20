import React from 'react';
import styled from 'styled-components';
import { Row, ButtonPrimary } from './../styles';
import PropTypes from 'prop-types';

const NavBar = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 75px;
  background-color: black;
  z-index: 999;
  padding-left: 1em;
  padding-right: 1em;
  
  a{
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    margin-right: 3em;
    font-weight: bold;
    
    &:hover{
      color: yellow;
    }
  }
`;

export const Navigation = ({ onMenuClicked } ) => {
  return (
      <NavBar>
        <img src={`${window.location.href}images/eth-tv/logo-white.png`} width="50" height="50" />

        <Row style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>

          <a href="">ETH.TV</a>
          <a href="">ABOUT</a>
          <a href="">FAQ</a>
          <a href="">PRESS</a>

          <ButtonPrimary primary onClick={() => onMenuClicked()}>Request new link</ButtonPrimary>
        </Row>

      </NavBar>
  )
}

Navigation.propTypes = {
  onMenuClicked: PropTypes.func.isRequired,
}
