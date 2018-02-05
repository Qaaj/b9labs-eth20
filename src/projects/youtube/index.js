import React from 'react';
import {Helmet} from 'react-helmet';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import { Button } from '../../styles/index';
import styled, {keyframes}  from 'styled-components';
import {Navigation} from './components/Navigation';
import RequestLinkPanel from './components/RequestLinkPanel';
import YouTubeComponent from './components/YouTubeComponent';
import { requestNewVideo, requestCurrentVideo } from './reducer';
import { ToastContainer, toast} from 'react-toastify';
import { Row } from './styles';
import {Logo} from '../../../public/images/eth-tv/logo.png';
import {ButtonPrimary} from './styles';

let POLLER;
var myTimeOut;

// language=LESS
const fadeIn = keyframes`
  0% {
    visibility: hidden;
    opacity: 0;
  }
  
  1% {
    visibility: visible;
  }
  
  35%{
    opacity: 1;
  }

  75% {
    opacity: 1;
  }
  
  100% {
    opacity: 0;
    visibility: hidden;
  }
`;

const fadeOut = keyframes`
  0% {
    visibility: visible;
    opacity: 1;
  }
  
  100% {
    opacity: 0;
    visibility: hidden;
  }
`;

const EthTVContainer = styled.div`
  background-color: black;
  color: black;
`;

const Fade = styled.div`
  display: inline-block;
  visibility: ${props => props.out ? 'hidden' : 'visible'};
  animation: ${props => props.out ? null : fadeIn} 4s linear;
  transition: visibility 4s linear;
  opacity: 0;
`;



const Overlay = styled.div`
      position: absolute;
      display: flex;
      flex-direction: row;
      z-index: 99999;
      position: fixed;
      top: 75px;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: black;
      color: white;
      font-size: 2em;
      align-items: center;
      justify-content: center;
 `;

class Youtube extends React.PureComponent {

  state = {};

  constructor(props) {
    super(props);

    this.state = {
      showMessage: false,
      showRequestLinkPanel: false,

      isPlaying: false,

      videoPlayer: {
        width: window.innerWidth,
        height: window.innerHeight,
      },

      playerVisibility: 'hidden',
    };

    window.addEventListener('resize', this.onWindowResizedHandler);
  }
  componentDidMount(){
    this.props.requestCurrentVideo(this.props.contract);

    if(this.props.url && this.props.url.length > 0){
      this.setState({
        playerVisibility: 'visible'
      })
    }

    this.startPolling();
  }

  componentDidUpdate(prevProps, prevState){
    //console.log(nextProps, nextState)

    if(prevProps.url !== this.props.url){
      console.log('URL Changed from' , prevProps , ' to ' , this.props.url);

      if(!this.state.showMessage){
        this.showNotification('New video received!');

        window.setTimeout(() => {
          this.setState({
            showMessage: true,
            playerVisibility: 'hidden'
          });

          window.setTimeout(() => {
            this.setState({ showMessage: false, playerVisibility: 'visible'})
          }, 4000);

        }, 750);
      }


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

    this.showNotification('Please submit your transaction.');

    // Instantiate contract once web3 provided.
    this.props.requestNewVideo(params.url, params.message, this.props.contract, this.props.accounts)
  };

  showNotification = (msg) => {
    toast(msg, { type: toast.TYPE.WARNING });
  };

  renderPlayer = () => {
    return (
        <div>
          <Fade out={!this.state.showMessage}>
            <Overlay>
              {this.props.message}
            </Overlay>
          </Fade>

          <YouTubeComponent style={{visibility: this.state.playerVisibility }}
                            videoPlayer={this.state.videoPlayer}
                            url={this.props.url} />
        </div>
    )
  }

  render() {
    const { props } = this;

    return (<EthTVContainer>
      <Helmet>
        <meta charSet="utf-8" />
        <title>ETH.TV - Decentralised Television</title>
        <link rel="canonical" href="http://tv.teamhut.co" />
      </Helmet>

      <ToastContainer style={{ top: '85px'}}/>


      <Navigation onMenuClicked={() => this.setState({ showRequestLinkPanel: true })} />

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

