import React from 'react';
import {Button} from 'semantic-ui-react';
import styled from 'styled-components';
import {Column} from '../styles';
import { Row, ButtonPrimary } from './../styles';
import PropTypes from 'prop-types';
import { media } from './../styles';

const Mobile = styled.div`
    padding-right: 2em;
    padding-left: 2em;
    display: none;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    background-color: grey;
    
   ${media.giant`  
      dislay: none;
   `}
   
  ${media.desktop`
      dislay: none;
   `}
  
  ${media.tablet`
      display: none;
   `}
    
  ${media.phone`
     display: flex;
     flex: 1;
  `} 
`;

const Desktop = styled.div`
  //position: absolute;
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
    cursor: hand;
    cursor: pointer;
    border-bottom: ${props => props.selected ? 'solid 2px yellow' : null };
    
    &:hover{
      color: yellow;
      border-bottom: solid 2px yellow;
    }
  }
  
   ${media.giant`  
    dislay: flex;
   `}
   
  ${media.desktop`
    dislay: flex;
   `}
  
  ${media.tablet`
      display: flex; 
   `}
    
  ${media.phone`
     display: none;
  `} 
`;

const MobileNavButton = styled.button`
  display: flex;
  flex: 1;
  font-size: 3em;
  cursor: hand;
  cursor: pointer;
  padding: 1em;
  outline: none;
  border: 1px solid darkgrey;
  color: ${(props) => props.selected ? 'black' : 'white'};
  background-color: ${(props) => props.selected ? 'yellow' : 'black'};
  font-weight: bold;
  justify-content: center;
  
  &:hover{
    color: ${(props) => props.selected ? 'black' : 'black'};
    background-color: ${(props) => props.selected ? 'navajowhite' : 'yellow'};
  }
  
  ${media.tablet`
      border-bottom: 0px;
   `}
    
  ${media.phone`
     border-bottom: 0px;
  `} 
`;

const MobileOverlay = styled(Column)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  z-index: 99999;
  margin: 0;
  touch-action: none;  
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: red;
  
  ${media.giant`  
      dislay: none;
   `}
   
  ${media.desktop`
      dislay: none;
   `}
  
  ${media.tablet`
      display: none;
   `}
    
  ${media.phone`
     display: ${props => props.isVisible ? 'flex' : 'none'};
     flex: 1;
  `} 
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  //border-bottom: 1px solid lightgray;
  font-size: 0.8em;
  height: 75px;
  max-height: 75px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  //z-index: 9999;
`;

class Navigation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,

      isMobileNavShown: true,
    }
  }

  onMobileNavClicked = () => {
    this.setState({
      isMobileNavShown: !this.state.isMobileNavShown,
    });
  };

  renderIcon = (src) => {
    return (
        <div></div>
    )
  }

  render(){
    const { onMenuClicked } = this.props;

    const menuItems = [
      {
        label: 'ETH.TV', url: '/',
      },{
        label: 'About', url: '/about',
      }, {
        label: 'FAQ', url: '/faq',
      }, {
        label: 'PRESS', url: '/press',
      }, {
        label: 'Request New', url: '/new',
      },
    ];

    return (<Container>
          <Mobile>
            <img src={`${window.location.href}images/eth-tv/logo-white.png`}
                 width="50" height="50"
                 style={{ cursor: 'hand', cursor: 'pointer' }} />

            <ButtonPrimary primary onClick={() => onMenuClicked()}>Request new link</ButtonPrimary>
            <img src={`${window.location.href}images/eth-tv/icons/hamburger-icon.png`}
                 width="50" height="37"
                 onClick={() => this.onMobileNavClicked()}
                 style={{}}/>

          </Mobile>

          <MobileOverlay isVisible={this.state.isMobileNavShown}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1em',
              marginBottom:
                  '2em', paddingLeft: '2em', paddingRight: '2em'}}>

                <img src={`${window.location.href}images/eth-tv/logo-white.png`}
                     width="50" height="50"
                     style={{ cursor: 'hand', cursor: 'pointer' }}
                     onClick={() => this.onMenuClicked({url: '/'}, 0)} />

                <img src={`${window.location.href}images/eth-tv/icons/icon-close.png`}
                     width="35"
                     height="35"
                     onClick={() => {this.setState({ isMobileNavShown: false })}}
                     style={{ cursor: 'hand', cursor: 'pointer' }} />
            </div>

            {menuItems.map((item, i) => <MobileNavButton key={item.label}
                                                   selected={i == this.state.selectedIndex}
                                                   onClick={() => this.onMenuClicked(item, i)}>
              {item.label.toUpperCase()}
            </MobileNavButton>)}
          </MobileOverlay>

          <Desktop>
            <img src={`${window.location.href}images/eth-tv/logo-white.png`}
                 width="50" height="50"
                 style={{ cursor: 'hand', cursor: 'pointer' }} />

            <Row style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>

              { menuItems.map((item, i) => <a key={i} onClick={() => onMenuClicked()}>{item.label.toUpperCase()}</a>)}
              <ButtonPrimary primary onClick={() => onMenuClicked()}>Request new link</ButtonPrimary>
            </Row>

          </Desktop>
        </Container>
    )
  }
}

Navigation.propTypes = {
  onMenuClicked: PropTypes.func.isRequired,
}

export default Navigation;
