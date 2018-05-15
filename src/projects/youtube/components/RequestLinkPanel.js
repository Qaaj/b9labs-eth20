import React from 'react';
import {Form, Input, Label, Message, TextArea} from 'semantic-ui-react';
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

  componentDidMount(){
    Promise.all([
        //this.state.gasCosts * this.state.gasPrice
      this.getBalance(this.props.accounts[0]),
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
          errorMessages: this.state.errorMessages.concat([`No sufficient funds in your wallet @ ${this.props.accounts[0]}`])
        })
      };**/
  }

  validateInput = (input) => {
    let result = false;

    const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    // If input is long enough
    if(input && input.length > 5){
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

    console.log('FEE = ' , this.state.gasPrice  * this.state.gasCosts)

    // Min. fee of 0
    if(this.state.gasPrice  * this.state.gasCosts > 0){
      result = true;
    }

    return result;
  };

  validateAccountBalance = (balance) => {
    let result = false;

    // Min. account balance of 0
    if(balance.toNumber() > 0){
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
    if(
        this.validateInput(this.state.addNewLinkURL) &&
        this.validateFee() &&
        this.validateAccountBalance(this.state.accountBalance)
    ){
      this.setState({
        isFormValid: true,
        errorMessages: []
      });

      this.props.onSendClickedHandler({
        url: this.state.addNewLinkURL,
        message: this.state.message,
        isCustomMessageAdded: this.state.isCustomMessageAdded
      })
    }else{
      this.setState({
        isFormValid: false,
        errorMessages: ['That\'s not a valid URL.']
      })
    }
  };

  getBalance = (account) => {
    return new Promise((resolve, reject) => {
      return this.props.web3.eth.getBalance(account, (err, res) => {
        if(err) reject(err);
        resolve(res);
      })
    });
  };

  getGasPrice = () => {
    return new Promise((resolve, reject) => {
      return this.props.web3.eth.getGasPrice((err, res) => {
        if(err) reject(err);
        resolve(res);
      })
    });
  };

  estimateGasCosts = () => {
    //console.log('Estimating gas costs to ...' , this.props.contract.address.toString());

    // TODO: Improve estimation w. reall address & data
    return new Promise((resolve, reject) => {
      this.props.web3.eth.estimateGas({
        from: this.props.accounts[0].toString(),
        to: "0xc4abd0339eb8d57087278718986382264244252f",
        data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
      }, (err, res) => {
        if(err) reject(err)
        resolve(res);
      });
    });
  };

  render() {
    const CONTRACT_ADDRESS = this.props.contract.address.toString();

    return  (
        <RequestLinkPanelContainer
                     isOpen={this.props.isOpen}
                     title="Show Your Video To The World!"
                     onClose={this.props.onCloseClick}
                     onConfirm={() => this.onSubmitForm()}>
          <div>

            <Row>
              <Column style={{ flex: 3}}>
                <h2>How does it work?</h2>
                <p>
                  Show your video to the world by sending an Ethereum transaction.<br />
                  Copy paste your video URL in the input field below and press confirm.<br /><br />
                  Your MetaMask/Mist wallet will pop-up, asking to submit the confirmation.<br /><br />

                  Your submitted video will be broadcasted as soon as the transaction is confirmed.<br /><br />
                </p>
              </Column>

              <Column style={{ flex: 2}}>
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
          <h2>Send to ETH.TV</h2>
          <Form.Field>
            <label htmlFor="userAddress">FROM</label>

            <Label style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
                   as='a'
                   onClick={() => window.open(`https://etherscan.io/address/${this.props.accounts[0]}`) }
                   alt="Click to show your address on Etherscan"
                   title="Click to show your address on Etherscan">
              <Blocky seed={this.props.accounts[0]} />

              <Column style={{ marginLeft: 25 }}>
                Your Wallet Address
                <strong>{this.props.accounts[0]}</strong>
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
              <label htmlFor="input" style={{ textTransform: 'capitalize'}}>VIDEO URL</label>
              <Input size="big" name="input" type="text" placeholder="https://www.youtube.com/watch?v=jlNvOWDfMYo" onChange={(evt) => this.setState({ addNewLinkURL: evt.target.value })} />
            </Form.Field>

           { this.state.isCustomMessageAdded && <Form.Field>
              <label htmlFor="message">MESSAGE</label>
              <TextArea placeholder="Add your message" id="message" name="message" value={this.state.message} onChange={(evt) => this.setState({ message: evt.target.value })} />
            </Form.Field>}

          <Form.Checkbox label='I want to add a custom message.' checked={this.state.isCustomMessageAdded} onClick={() => this.setState({ isCustomMessageAdded: !this.state.isCustomMessageAdded })} />
          <Form.Group widths="equal" style={{ display: 'flex', flexDirection: 'row'}}>
            <Form.Field>
              <label htmlFor="inputCost">COST (in wei)</label>
              <Row style={{ alignItems: 'center'}}>
                <input type="number" disabled min={0} placeholder={this.state.inputCost} id="inputCost" name="inputCost" value={this.state.inputCost} />
                wei
              </Row>
              <span><small>Your balance: {this.state.accountBalance.toString()} wei available</small></span>
            </Form.Field>

            <Form.Field>
              <label htmlFor="inputFee">FEE (in wei)</label>
              <Row style={{ alignItems: 'center'}}>
                <input disabled type="number" min={0} placeholder={this.state.gasCosts * this.state.gasPrice} id="inputFee" name="inputFee" value={this.state.gasCosts * this.state.gasPrice} onChange={(evt) => this.setState({ fee: evt.target.value })} />
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
RequestLinkPanel.propTypes    = {
  contract: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,

  onCloseClick: PropTypes.func.isRequired,
  onSendClickedHandler: PropTypes.func.isRequired,
};

export default RequestLinkPanel;
