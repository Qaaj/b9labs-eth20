import React from 'react';
import { Form, Input, Label, Message, TextArea, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import Blocky from './Blocky';
import BaseModal from './modals/BaseModal';
import { Row, Column } from '../styles';
import PropTypes from 'prop-types';

const RequestLinkPanelContainer = styled(BaseModal)`
 
`;

class RequestLinkPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFormSuccess: true,
      errorMessages: [],

      addNewLinkURL: '',
      isCustomMessageAdded: false,
      message: '',

      fee: 0,
      inputCost: 0,

      accountBalance: 0,

      gasPrice: 0,
      gasCosts: 0,
    }
  }

  componentDidMount() {

    const currentAccount = this.props.accounts ? this.props.accounts[0] : '';

    // Move this logic to the store - components does not want dependency of props.accounts[]
    if (this.props.isLoaded) Promise.all([
      //this.state.gasCosts * this.state.gasPrice
      this.getBalance(currentAccount),
      this.getGasPrice(),
      this.estimateGasCosts(),
    ]).then(res => {
      this.setState({
        accountBalance: res[0],
        gasPrice: res[1],
        gasCosts: res[2]
      })
    });


    /**
     // TODO: Improve with web3 bignumber comparison?
     if(!this.validateAccountBalance(balance.toString())){
        this.setState({
          isFormSucces: false,
          errorMessages: this.state.errorMessages.concat([`No sufficient funds in your wallet @ ${currentAccount}`])
        })
      };**/
  }

  componentWillUnmount() {
  }

  validateInput = (input) => {
    let result = false;

    const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    // If input is long enough
    if (input && input.length > 5) {
      // Check if it's a valid url
      // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
      if (input.match(regex)) {
        result = true;
      } else {
        result = false;
      }
    }

    return result;
  };

  validateFee = () => {
    let result = false;

    //console.log('FEE = ' , this.state.gasPrice  * this.state.gasCosts)

    // Min. fee of 0
    if (this.state.gasPrice * this.state.gasCosts > 0) {
      result = true;
    }

    return result;
  };

  validateAccountBalance = (balance) => {
    let result = false;

    // Min. account balance of 0
    if (balance.toNumber() > 0) {
      result = true;
    }

    return result;
  };

  onSubmitForm = () => {
    this.setState({
      isFormValid: false,
      errorMessages: []
    });

    // TODO: Improve this & return specific errorMessages for each validator
    if (
        this.validateInput(this.state.addNewLinkURL) &&
        this.validateFee() &&
        this.validateAccountBalance(this.state.accountBalance)
    ) {
      this.setState({
        isFormValid: true,
        errorMessages: []
      });

      this.props.onSendClickedHandler({
        url: this.state.addNewLinkURL,
        message: this.state.message,
        isCustomMessageAdded: this.state.isCustomMessageAdded,
        payment: this.props.web3.toWei(0.5, 'ether')
      });

      // RESET FORM
      this.setState({
        url: '',
        message: '',
        isCustomMessageAdded: false,
      })
    } else {
      this.setState({
        isFormValid: false,
        errorMessages: ['That\'s not a valid URL.']
      })
    }
  };

  getBalance = (account) => {
    return new Promise((resolve, reject) => {
      return this.props.web3.eth.getBalance(account, (err, res) => {
        if (err) reject(err);
        resolve(res);
      })
    });
  };

  getGasPrice = () => {
    return new Promise((resolve, reject) => {
      return this.props.web3.eth.getGasPrice((err, res) => {
        if (err) reject(err);
        resolve(res);
      })
    });
  };

  estimateGasCosts = () => {
    //console.log('Estimating gas costs to ...' , this.props.contract.address.toString());
    // const currentAccount = this.props.accounts ? this.props.accounts[0] : '';

    // TODO: Improve estimation w. reall address & data
    // We need the real contract address of the contract in contract.address
    return new Promise((resolve, reject) => {
      resolve(100000);
    //   this.props.web3.eth.estimateGas({
    //     from: currentAccount.toString(),
    //     to: this.props.contract.address.toString(),
    //     data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
    //   }, (err, res) => {
    //     if (err) reject(err)
    //     resolve(res);
    //   });
    });
  };

  onCloseClick = () => {
    this.setState({
      isFormSuccess: true,
      errorMessages: [],

      addNewLinkURL: '',
      isCustomMessageAdded: false,
      message: '',

      fee: 0,
      inputCost: 0,

      accountBalance: 0,

      gasPrice: 0,
      gasCosts: 0,
    });

    this.props.onCloseClick();
  };

  render() {

    if (!this.props.isLoaded || !this.props.accounts) return <Loader inverted active size='large'>Loading
      Contract.</Loader>;

    const CONTRACT_ADDRESS = this.props.contract.address ? this.props.contract.address.toString() : '';
    const currentAccount = this.props.accounts.length > 0 ? this.props.accounts[0] : '';

    return (
        <RequestLinkPanelContainer
            isOpen={this.props.isOpen}
            title="Show Your Video To The World!"
            onClose={this.onCloseClick}
            onConfirm={() => this.onSubmitForm()}>
          <div>

            <Row>
              <Column style={{ flex: 3 }}>
                <h2>How does it work?</h2>
                <p>
                  Show your video to the world by sending an Ethereum transaction.<br />
                  Copy paste your video URL in the input field below and press confirm.<br /><br />
                  Your MetaMask/Mist wallet will pop-up, asking to submit the confirmation.<br /><br />

                  Your submitted video will be broadcasted as soon as the transaction is confirmed.<br /><br />
                </p>
              </Column>

              <Column style={{ flex: 2 }}>
                <h2>What do we support?</h2>

                Wallets
                <ul>
                  <li>MetaMask, Mist, ...</li>
                </ul>

                Links
                <ul>
                  <li>YouTube, Twitch, Vimeo, Wistia</li>
                  <li>SoundCloud, Streamable, DailyMotion</li>
                  <li>Facebook/Twitter Live</li>
                  <li>DropBox files</li>
                </ul>
              </Column>
            </Row>

            <Form success={this.state.errorMessages.length === 0 && this.state.isFormValid}
                  error={this.state.errorMessages.length > 0}>
              <h2>Send a transaction</h2>
              <Form.Field>
                <label htmlFor="userAddress">FROM</label>

                <Label style={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                       as='a'
                       onClick={() => window.open(`https://etherscan.io/address/${currentAccount}`) }
                       alt="Click to show your address on Etherscan"
                       title="Click to show your address on Etherscan">
                  <Blocky seed={currentAccount} />

                  <Column style={{ marginLeft: 25 }}>
                    {currentAccount === '' ? 'Please unlock your wallet.' : 'Your Wallet Address'}
                    <strong>{currentAccount}</strong>
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
                       onClick={() => window.open(`https://etherscan.io/address/${CONTRACT_ADDRESS}`) }
                       alt="Click to see contract on Etherscan"
                       title="Click to show contract on Etherscan">
                  <Blocky seed={CONTRACT_ADDRESS} />

                  <Column style={{ marginLeft: 25 }}>
                    ETH.TV Contract address
                    <strong>{CONTRACT_ADDRESS}</strong>
                  </Column>
                </Label>
              </Form.Field>

              <Form.Field required>
                <label htmlFor="input" style={{ textTransform: 'capitalize' }}>VIDEO URL</label>
                <Input size="big" name="input" type="text" placeholder="https://www.youtube.com/watch?v=jlNvOWDfMYo"
                       onChange={(evt) => this.setState({ addNewLinkURL: evt.target.value })} />
              </Form.Field>

              { this.state.isCustomMessageAdded && <Form.Field>
                <label htmlFor="message">MESSAGE</label>
                <TextArea placeholder="Add your message" id="message" name="message" value={this.state.message}
                          onChange={(evt) => this.setState({ message: evt.target.value })} />
              </Form.Field>}

              <Form.Checkbox label='I want to add a custom message for 0.5 ETH.'
                             checked={this.state.isCustomMessageAdded} onClick={() => {
                if (!this.state.isCustomMessageAdded) {
                  this.setState({ inputCost: this.props.web3.toWei(0.5, 'ether') })
                } else {
                  this.setState({ inputCost: this.props.web3.toWei(0, 'ether') })
                }

                this.setState({ isCustomMessageAdded: !this.state.isCustomMessageAdded })
              }
              } />
              <Form.Group widths="equal" style={{ display: 'flex', flexDirection: 'row' }}>
                <Form.Field>
                  <label htmlFor="inputCost">COST (in wei)</label>
                  <Row style={{ alignItems: 'center' }}>
                    <input type="number" disabled min={0} placeholder={this.state.inputCost} id="inputCost"
                           name="inputCost" value={this.state.inputCost} />
                    wei
                  </Row>
                  <span><small>Your balance: {this.state.accountBalance.toString()} wei available</small></span>
                </Form.Field>

                <Form.Field>
                  <label htmlFor="inputFee">FEE (in wei)</label>
                  <Row style={{ alignItems: 'center' }}>
                    <input disabled type="number" min={0} placeholder={this.state.gasCosts * this.state.gasPrice}
                           id="inputFee" name="inputFee" value={this.state.gasCosts * this.state.gasPrice}
                           onChange={(evt) => this.setState({ fee: evt.target.value })} />
                    wei
                  </Row>
                  <span><small>Gas Price: {this.state.gasPrice.toString()} wei</small></span>
                </Form.Field>
              </Form.Group>

              <Message
                  error
                  header='An error occured'
                  list={this.state.errorMessages}
              />
            </Form>
          </div>
        </RequestLinkPanelContainer>
    );
  }
}

RequestLinkPanel.defaultProps = {};
RequestLinkPanel.propTypes = {
  contract: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  accounts: React.PropTypes.array,
  isLoaded: React.PropTypes.bool,
  onCloseClick: PropTypes.func.isRequired,
  onSendClickedHandler: PropTypes.func.isRequired,
};

export default RequestLinkPanel;
