import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Form, Label } from 'semantic-ui-react';
import styled, { keyframes }  from 'styled-components';
import BaseModal from './components/modals/BaseModal';
import Navigation from './components/Navigation';
import RequestLinkPanel from './components/RequestLinkPanel';
import YouTubeComponent from './components/YouTubeComponent';
import {
  requestNewVideo,
  requestCurrentVideo,
  addSmartContractEventWatchers,
  deleteReceipt,
} from './reducer';
import { ToastContainer, toast } from 'react-toastify';
import { Column, Row } from './styles';
import Blocky from './components/Blocky';

var WINDOW_RESIZE_TIMEOUT;
const HEADER_HEIGHT = 75;

// language=LESS
const fadeIn = keyframes`
  0
  %
  {
    visibility: hidden
  ;
    opacity: 0
  ;
  }

  1
  %
  {
    visibility: visible
  ;
  }

  35
  %
  {
    opacity: 1
  ;
  }

  75
  %
  {
    opacity: 1
  ;
  }

  100
  %
  {
    opacity: 0
  ;
    visibility: hidden
  ;
  }
`;

// eslint-disable-next-line
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
      flex-direction: column;
      z-index: 99999;
      position: fixed;
      top: 75px;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: black;
      color: white;
      font-size: 4rem;
      align-items: center;
      justify-content: center;
      
      .title-small{
        margin-top: 50px;
        text-transform: capitalize;
        font-size: 1.5rem;
      }
      
      .address{
        color: darkgrey;
        margin: 10px;
        font-size: 1rem;
      }
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

  componentDidMount() {
    // Not dispatching here, as contract load can be a tad slow
    // this.props.requestCurrentVideo(this.props.contract);

    if (this.props.url && this.props.url.length > 0) {
      this.setState({
        playerVisibility: 'visible'
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.url !== this.props.url) {
      if (!this.state.showMessage) {
        this.showNotification('New video received!');

        window.setTimeout(() => {
          this.setState({
            showMessage: true,
            playerVisibility: 'hidden'
          });

          window.setTimeout(() => {
            this.setState({ showMessage: false, playerVisibility: 'visible' })
          }, 4000);

        }, 750);
      }
    }

    // Contract was loaded
    if (prevProps.isLoading && !this.props.isLoading) {
      this.props.addEventWatchers(this.props.contract);

      // TODO: Refactor this
      this.getLastURL(this.props.contract);
    }
  }

  componentWillUnmount() {
  }

  onWindowResizedHandler = (evt) => {
    clearTimeout(WINDOW_RESIZE_TIMEOUT);

    WINDOW_RESIZE_TIMEOUT = setTimeout(() => {
      this.setState({
        ...this.state,
        videoPlayer: {
          ...this.state.videoPlayer,
          width: window.innerWidth,
          height: window.innerHeight - HEADER_HEIGHT,
        }
      });

      clearTimeout(WINDOW_RESIZE_TIMEOUT);
    }, 100);

    evt.preventDefault();
  };

  getLastURL = (contract) => {
    if (!contract) console.error('Needs a contract');
    return this.props.requestCurrentVideo(contract);
  };

  onSendClickedHandler = (params) => {
    this.setState({
      showRequestLinkPanel: false
    });

    this.showNotification('Please submit your transaction.');

    // Instantiate contract once web3 provided.
    this.props.requestNewVideo(params, this.props.contract, this.props.accounts)
  };

  showNotification = (msg) => {
    toast(msg, { type: toast.TYPE.WARNING });
  };

  renderTxReceipt = (txReceipt) => {
    console.log('SHOWING RECEIPT ', txReceipt)

    const { tx, from } = txReceipt;

    return (
        <BaseModal isOpen={txReceipt ? true : false}
                   title="Confirmation"
                   onClose={() => this.props.resetReceipt()}
                   onConfirm={() => this.props.resetReceipt()}>
          <Column style={{ marginLeft: '1em' }}>
            <h2>Receipt</h2>

            <Form widths="equal" style={{ marginBottom: '1em' }}>
              <Form.Group>
                <Form.Field>
                  <label htmlFor="userAddress">FROM</label>

                  <Label style={{
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                         as='a'
                         onClick={() => window.open(`https://etherscan.io/address/${from}`) }
                         alt="Click to show your address on Etherscan"
                         title="Click to show your address on Etherscan">
                    <Blocky seed={from} />

                    <Column style={{ marginLeft: 25 }}>
                      YOUR WALLET ADDRESS
                      <strong>{from}</strong>
                    </Column>
                  </Label>
                </Form.Field>

                <Form.Field>
                  <label htmlFor="contractAddress">TO</label>

                  <Label style={{
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                         as='a'
                         onClick={() => window.open(`https://etherscan.io/address/${this.props.contract.address}`) }
                         alt="Click to show Smart Contract on Etherscan"
                         title="Click to show Smart Contract on Etherscan">
                    <Blocky seed={this.props.contract.address} />

                    <Column style={{ marginLeft: 25 }}>
                      ETH.TV SMART CONTRACT ADDRESS
                      <strong>{this.props.contract.address}</strong>
                    </Column>
                  </Label>
                </Form.Field>
              </Form.Group>


              <Form.Field>
                <label htmlFor="userAddress">TRANSACTION</label>

                <Label style={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                       as='a'
                       onClick={() => window.open(`https://etherscan.io/tx/${tx}`) }
                       alt="Click to show Smart Contract on Etherscan"
                       title="Click to show Smart Contract on Etherscan">
                  <Blocky seed={tx} />

                  <Column style={{ marginLeft: 25 }}>
                    TRANSACTION REFERENCE
                    <strong>{tx}</strong>
                  </Column>
                </Label>
              </Form.Field>
            </Form>


            {txReceipt.message.length > 0 && (<div><h4>YOUR CUSTOM MESSAGE</h4>
              <Column>
                <Row>
                  <Column style={{}}>
                    "{txReceipt.message}"
                  </Column>
                </Row>
              </Column></div>)}

            <h4>DETAILS</h4>

            <Column>
              <Row>
                <Column style={{ flex: 1 }}>
                  VIDEO ID
                </Column>

                <Column style={{ flex: 3, alignItems: 'left' }}>
                  {txReceipt.id}
                </Column>
              </Row>

              <Row>
                <Column style={{ flex: 1 }}>
                  BLOCK HASH
                </Column>

                <Column style={{ flex: 3, alignItems: 'left' }}>
                  {txReceipt.blockHash}
                </Column>
              </Row>

              <Row>
                <Column style={{ flex: 1 }}>
                  BLOCK NR.
                </Column>

                <Column style={{ flex: 3, alignItems: 'left' }}>
                  {txReceipt.blockNumber}
                </Column>
              </Row>

              <Row>
                <Column style={{ flex: 1 }}>
                  GAS USED
                </Column>

                <Column style={{ flex: 3, alignItems: 'left' }}>
                  {txReceipt.gasUsed} wei
                </Column>
              </Row>

              <Row>
                <Column style={{ flex: 1 }}>
                  CUMULATIVE GAS USED
                </Column>

                <Column style={{ flex: 3, alignItems: 'left' }}>
                  {txReceipt.cumulativeGasUsed} wei
                </Column>
              </Row>

              <Row>
                <Column style={{ flex: 1 }}>
                  STATUS
                </Column>

                <Column style={{ flex: 3, alignItems: 'left' }}>
                  {txReceipt.status}
                </Column>
              </Row>
            </Column>
          </Column>
        </BaseModal>
    )
  };

  renderPlayer = () => {
    return (
        <div>
          <Fade out={!this.state.showMessage}>
            <Overlay>
              <div>{this.props.message}</div>

              <div className="title-small">REQUESTED BY</div>
              <div className="address">{this.props.from}</div>
            </Overlay>
          </Fade>

          <YouTubeComponent style={{ visibility: this.state.playerVisibility }}
                            videoPlayer={this.state.videoPlayer}
                            url={this.props.url} />
        </div>
    )
  };

  renderLoading() {
    return (
        <div>Loading...</div>
    )
  }

  render() {
    const { props } = this;

    return (<EthTVContainer>
      <Helmet>
        <meta charSet="utf-8" />
        <title>ETH.TV - Decentralised Television</title>
        <link rel="canonical" href="http://ethtelevision.com" />
      </Helmet>

      <ToastContainer style={{ top: '85px' }} />

      <Navigation onMenuClicked={() => this.setState({ showRequestLinkPanel: true })} />

      { this.props.txReceipt ? this.renderTxReceipt(this.props.txReceipt) : null }

      <RequestLinkPanel isOpen={this.state.showRequestLinkPanel}
                        isLoaded={this.props.isLoaded}
                        onSendClickedHandler={this.onSendClickedHandler}
                        onCloseClick={() => this.setState({ showRequestLinkPanel: false })}
                        contract={this.props.contract}
                        accounts={this.props.accounts}
                        web3={this.props.web3} />

      {this.renderPlayer()}
    </EthTVContainer>);

  }
}

const mapStateToProps = (state) => {
  return {
    web3: state.settings.get('web3'),
    contract: state.contracts.getIn(['Youtube', 'contract']),
    accounts: state.settings.get('accounts'),
    latestVideo: state.youtube.getIn(['latestVideo']),
    url: state.youtube.getIn(['latestVideo', 'url']),
    message: state.youtube.getIn(['latestVideo', 'message']),
    from: state.youtube.getIn(['latestVideo', 'from']),
    txReceipt: state.youtube.get('txReceipt'),
    isLoaded: state.contracts.getIn(['Youtube', 'isLoaded']),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addEventWatchers: (contract) => dispatch(addSmartContractEventWatchers(contract)),
    requestNewVideo: (params, contract, accounts) => dispatch(requestNewVideo(params, contract, accounts)),
    requestCurrentVideo: (contract) => dispatch(requestCurrentVideo(contract)),
    resetReceipt: () => dispatch(deleteReceipt())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);

