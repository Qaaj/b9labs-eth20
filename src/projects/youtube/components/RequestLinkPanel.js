import React from 'react';
import {Form, Input, Label, Message, TextArea} from 'semantic-ui-react';
import styled from 'styled-components';
import Blocky from './Blocky';
import BaseModal from './modals/BaseModal';
import { Row, Column } from '../styles';
import PropTypes from 'prop-types';

const ModalContainer = styled(BaseModal)`
  p{
    color: black;
  }
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

      accountBalance: this.getBalance(this.props.accounts[0]),
    }
  }

  validateInput = (input) => {
    let result = false;

    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
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

  validateFee = (fee) => {
    let result = false;

    if(fee > 0){
      result = true;
    }

    return result;
  };

  onSubmitForm = () => {
    this.setState({
      isFormValid: false,
      errorMessages: []
    });

    if(
        this.validateInput(this.state.addNewLinkURL) &&
        this.validateFee(this.state.fee)
    ){
      this.setState({
        isFormValid: true,
        errorMessages: []
      });

      this.props.onSendClickedHandler({url: this.state.addNewLinkURL, message: this.state.message})
    }else{
      this.setState({
        isFormValid: false,
        errorMessages: ['That\'s not a valid URL.']
      })
    }
  };

  getBalance = async (account) => {
    return this.props.web3.eth.getBalance(account, (err, res) => {
      if (err) console.log(err);
      this.setState({ accountBalance: res })
      return res;
    });

    /**var prom = new Promise((resolve, reject) => {
      this.props.web3.eth.getBalance(account, (err, res) => {
        if(err) reject();
        return res;
      });
    });

    // Using callback style for MetaMask's Web3
    let balance = prom.then(res => console.log('++++' , res));

    console.log(balance);

    return balance;**/
  }

  render() {
    const CONTRACT_ADDRESS = this.props.contract.address.toString();

    return  (
        <ModalContainer isOpen={this.props.isOpen}
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
          {console.log(this.props.accounts)}
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
                <input type="number" min={0} placeholder={this.state.fee} id="inputFee" name="inputFee" value={this.state.fee} onChange={(evt) => this.setState({ fee: evt.target.value })} />
                wei
              </Row>
            </Form.Field>
          </Form.Group>

          <Message
              error
              header='An error occured'
              list={this.state.errorMessages}
          />
        </Form>
      </div>
        </ModalContainer>
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
