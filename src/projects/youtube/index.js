import React from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import { Button } from '../../styles/index';
import styled, {keyframes}  from 'styled-components';
import YouTubeComponent from './components/YouTubeComponent';
import { requestNewVideo, requestCurrentVideo } from './reducer';
import { ToastContainer, toast} from 'react-toastify';

const Input = styled.input`
  border-radius: 3px;
  height: 25px;
  font-size: 18px;
  width: 200px;
  margin-right: 10px;
`;

const PlayerHolder = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let POLLER;
var youtube;

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

const Fade = styled.div`
  display: inline-block;
  visibility: ${props => props.out ? 'hidden' : 'visible'};
  animation: ${props => props.out ? fadeOut : fadeIn} 1s linear;
  transition: visibility 1s linear;
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
      showMessage: true,
      showRequestLinkPanel: false,

      storageValue: 0,
      web3: null,

      isPlaying: false,

      videoPlayer: {
        width: window.innerWidth,
        height: window.innerHeight,
        url: 'https://www.youtube.com/watch?v=0IefMXZrVYI',
      }
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
     
    `;

    return (
        <div>
          <Fade out={!this.state.showMessage}>
            <Overlay>
              Hi guys!
              qdsqs
              qs
              s
              q
              qsd
              qsd
              qsdqdsqsd
            </Overlay>
          </Fade>

          <YouTubeComponent videoPlayer={this.state.videoPlayer} />
        </div>
    )
  }

  componentDidMount(){
    this.startPolling();
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
      })

      clearTimeout(myTimeOut);
    }, 100);

    evt.preventDefault();
  };

  startPolling = () => {
    POLLER = window.setInterval(async () => {
      let url = await this.getLastURL();

      console.log('Polled URL: ' , url)

      if(url !== this.props.url){
        console.log('URL Changed! ' , console.log('Polled URL: ' , url))

        this.setState({
          ...this.state,
          videoPlayer: {
            ...this.state.videoPlayer,
            url: url
          }
        })

      }

    }, 500)
  }

  stopPolling = () => {

  }

  getLastURL = async () => {
    console.log('getting lasst url')
    return this.props.requestCurrentVideo(this.props.contract); //youtube.lastURL.call().then(result => result);
  };

  onSendClickedHandler = (params) => {
    // Instantiate contract once web3 provided.
    this.instantiateContract(params);
  };

  showNotification = (msg) => {
    toast(msg);
  };

  render() {
    const { props } = this;
    return (<div>
      {/** <h2>Youtube</h2>
      <Input onChange={(e) => this.setState({ URL: e.target.value })} />
      <Button onClick={() => props.requestNewVideo(this.state.URL, '', props.contract, props.accounts)}> Set
        URL</Button>
      <Button onClick={() => props.requestCurrentVideo(props.contract)}> Get the URL </Button>
      <p>{props.url ? `Latest URL: ${props.url}` : 'No URL set!'}</p>
      <PlayerHolder>
        <ReactPlayer url={props.url}
                     playing={true}
                     width={800}
                     height={450}
                     config={{ youtube: { playerVars: { showInfo: 0, } } }}
        />
      </PlayerHolder>**/}

      <ToastContainer />

      <NavBar>
        <a href="#">ETH.TV</a>
        <Button primary onClick={() => this.setState({ showRequestLinkPanel: true })}>Request new link</Button>
      </NavBar>

      <YouTubeComponent videoPlayer={{
        width: window.innerWidth,
        height: window.innerHeight,
        url: props.url
      }} />
    </div>);

  }
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Youtube', 'contract']),
    accounts: state.settings.get('accounts'),
    url: state.youtube.getIn(['latestVideo', 'url']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNewVideo: (url, message, contract, accounts) => dispatch(requestNewVideo(url, message, contract, accounts)),
    requestCurrentVideo: (contract) => dispatch(requestCurrentVideo(contract)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);

