import React from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import { Button } from '../../styles/index';
import styled, {keyframes}  from 'styled-components';
import RequestLinkPanel from './components/RequestLinkPanel';
import YouTubeComponent from './components/YouTubeComponent';
import { requestNewVideo, requestCurrentVideo } from './reducer';
import { ToastContainer, toast} from 'react-toastify';

import {Logo} from '../../../public/images/eth-tv/logo.png';

let POLLER;
var myTimeOut;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const EthTVContainer = styled.div`
  background-color: black;
  color: black;
`;

const Fade = styled.div`
  display: inline-block;
  visibility: ${props => props.out ? 'hidden' : 'visible'};
  animation: ${props => props.out ? fadeOut : fadeIn} 4s alternate;
  transition: visibility 4s linear;
`;

const NavBar = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 75px;
  background-color: black;
  z-index: 9998;
  padding-left: 1em;
  padding-right: 1em;
  
  a{
    color: white;
    text-transform: uppercase;
    text-decoration: none;
  }
`;

class Youtube extends React.PureComponent {

  state = {};

  constructor(props) {
    super(props);

    this.state = {
      showMessage: false,
      showRequestLinkPanel: false,

      storageValue: 0,

      isPlaying: false,

      videoPlayer: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    window.addEventListener('resize', this.onWindowResizedHandler);

    props.requestCurrentVideo(props.contract, props.accounts);
  }

  renderPlayer = () => {
    const Overlay = styled.div`
      position: absolute;
      display: flex;
      flex-direction: row;
      z-index: 99999;
  
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: black;
      color: white;
      font-size: 2em;
      align-items: center;
      justify-content: center;
      opacity: 1;
     
    `;

    return (
        <div>
          <Fade out={!this.state.showMessage}>
            <Overlay>
              {this.props.message}
            </Overlay>
          </Fade>

          <YouTubeComponent videoPlayer={this.state.videoPlayer} url={this.props.url} />
        </div>
    )
  }

  componentDidMount(){
    this.startPolling();
  }

  componentDidUpdate(prevProps, prevState){
    //console.log(nextProps, nextState)

    if(prevProps.url !== this.props.url){
      console.log('URL Changed from' , prevProps , ' to ' , this.props.url);

      this.setState({
        showMessage: true
      });

      window.setTimeout(() => {
        this.showNotification('New video received!');
        this.setState({ showMessage: false})
      }, 2000);
    }
  }

  componentWillUnmount(){
    window.clearInterval(POLLER)
  }

  onWindowResizedHandler = (evt) => {
    clearTimeout(myTimeOut);

    myTimeOut = setTimeout(() => {
      this.setState({
        ...this.state,
        videoPlayer: {
          ...this.state.videoPlayer,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      });

      clearTimeout(myTimeOut);
    }, 100);

    evt.preventDefault();
  };

  startPolling = () => {
    POLLER = window.setInterval(async () => {
      let url = await this.getLastURL();
    }, 500)
  };

  getLastURL = async () => {
    return this.props.requestCurrentVideo(this.props.contract);
  };

  onSendClickedHandler = (params) => {
    this.setState({
      showRequestLinkPanel: false
    });
      // Instantiate contract once web3 provided.
    this.props.requestNewVideo(params.url, params.message, this.props.contract, this.props.accounts)
  };

  showNotification = (msg) => {
    toast(msg);
  };

  render() {
    const { props } = this;

    return (<EthTVContainer>
      <ToastContainer />

      <NavBar>
        <img src={`${window.location.href}images/eth-tv/logo-white.png`} width="50" height="50" />

        <Button primary onClick={() => this.setState({ showRequestLinkPanel: true })}>Request new link</Button>
      </NavBar>

      <RequestLinkPanel isOpen={this.state.showRequestLinkPanel}
                        onSendClickedHandler={this.onSendClickedHandler}
                        onCloseClick={() => this.setState({ showRequestLinkPanel: false })} />

      {this.renderPlayer()}
    </EthTVContainer>);

  }
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Youtube', 'contract']),
    accounts: state.settings.get('accounts'),
    url: state.youtube.getIn(['latestVideo', 'url']),
    message: state.youtube.getIn(['latestVideo', 'message']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNewVideo: (url, message, contract, accounts) => dispatch(requestNewVideo(url, message, contract, accounts)),
    requestCurrentVideo: (contract) => dispatch(requestCurrentVideo(contract)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);

