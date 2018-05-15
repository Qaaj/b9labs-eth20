import React from 'react';
import {Helmet} from 'react-helmet';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import { Button } from '../../styles/index';
import styled, {keyframes}  from 'styled-components';
import BaseModal from './components/modals/BaseModal';
import Navigation from './components/Navigation';
import RequestLinkPanel from './components/RequestLinkPanel';
import YouTubeComponent from './components/YouTubeComponent';
import { requestNewVideo, requestCurrentVideo, requestTxReceipt, addSmartContractEventWatchers} from './reducer';
import { ToastContainer, toast} from 'react-toastify';
import {Column, Row} from './styles';
import {Logo} from '../../../public/images/eth-tv/logo.png';
import {ButtonPrimary} from './styles';

var myTimeOut;
const HEADER_HEIGHT = 75;

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
  max-height: 100vh;
  overflow-y: hidden;
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
        height: window.innerHeight - HEADER_HEIGHT,
      },

      playerVisibility: 'hidden',
    };

    window.addEventListener('resize', this.onWindowResizedHandler);
  }
  componentDidMount(){
    // Not dispatching here, as contract load can be a tad slow
    // this.props.requestCurrentVideo(this.props.contract);

    if(this.props.url && this.props.url.length > 0){
      this.setState({
        playerVisibility: 'visible'
      })
    }
  }

  componentDidUpdate(prevProps, prevState){
    //console.log(nextProps, nextState)

    if(prevProps.url !== this.props.url){
      console.log('URL Changed to ' , this.props.url);

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

    // Contract was loaded
    if(prevProps.isLoading && !this.props.isLoading){
      this.props.addEventWatchers(this.props.contract);
      this.props.getLastURL(this.props.contract);
    }
  }

  componentWillUnmount(){
  }

  onWindowResizedHandler = (evt) => {
    clearTimeout(myTimeOut);

    myTimeOut = setTimeout(() => {
      this.setState({
        ...this.state,
        videoPlayer: {
          ...this.state.videoPlayer,
          width: window.innerWidth,
          height: window.innerHeight - HEADER_HEIGHT,
        }
      });

      clearTimeout(myTimeOut);
    }, 100);

    evt.preventDefault();
  };

  getLastURL = (contract) => {
    if(!contract) throw('Needs a contract instance');

    return this.props.requestCurrentVideo(contract);
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

  renderTxReceipt = (txReceipt) => {
    if(!txReceipt) return <div>No receipt</div>;

    //console.log('RECEIPT = ' , txReceipt)

    return <div>Receipt</div>;
    /**let content = txReceipt.map((val, key) => {
                  if(typeof val === 'object'){
                    let subItems = val.map((objVal, objKey) => {
                      return (<div key={objKey}>{objKey}: {objVal}</div>)
                    });

                    // Maps as children is still experimental in current React version
                    return subItems.toArray();
                  }else{
                    return (<div key={key}>{key}: {val}</div>)
                  }
                }).toArray();

    return (
        <BaseModal isOpen={txReceipt ? true : false}
                         title="Your Receipt!"
                         onClose={() => null}
                         onConfirm={() => null}>
          <Column style={{ marginLeft: '1em' }}>
            <h2>Transaction</h2>

            <Column>
              { content }
            </Column>

            <br />

            <ButtonPrimary onClick={() => window.open(`https://ropsten.etherscan.io/tx/${txReceipt.get('tx')}`)} text="View transaction">View on Etherscan</ButtonPrimary>
          </Column>



        </BaseModal>
    )**/
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

  renderLoading(){
    return (
        <div>Loading...</div>
    )
  }

  render() {
    const { props } = this;

    if(props.isLoading){
      return this.renderLoading();
    }else{
      return (<EthTVContainer>
        <Helmet>
          <meta charSet="utf-8" />
          <title>ETH.TV - Decentralised Television</title>
          <link rel="canonical" href="http://tv.teamhut.co" />
        </Helmet>

        <ToastContainer style={{ top: '85px'}}/>

        <Navigation onMenuClicked={() => this.setState({ showRequestLinkPanel: true })} />

        { this.renderTxReceipt(this.props.txReceipt) }

        <RequestLinkPanel isOpen={this.state.showRequestLinkPanel}
                          onSendClickedHandler={this.onSendClickedHandler}
                          onCloseClick={() => this.setState({ showRequestLinkPanel: false })} />

        {this.renderPlayer()}

      </EthTVContainer>);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Youtube', 'contract']),
    accounts: state.settings.get('accounts'),
    url: state.youtube.getIn(['latestVideo', 'url']),
    message: state.youtube.getIn(['latestVideo', 'message']),
    txReceipt: state.youtube.get('txReceipt'),
    isLoading: state.contracts.getIn(['Youtube', 'contract']) ? false : true,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addEventWatchers: (contract) => dispatch(addSmartContractEventWatchers(contract)),
    requestNewVideo: (url, message, contract, accounts) => dispatch(requestNewVideo(url, message, contract, accounts)),
    requestCurrentVideo: (contract) => dispatch(requestCurrentVideo(contract)),
    requestTxReceipt: (txHash) => dispatch(requestTxReceipt(txHash))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);

