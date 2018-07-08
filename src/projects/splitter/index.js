import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Button} from '../../styles/index';

const Input = styled.input`
  border-radius: 3px;
  height: 25px;
  font-size: 18px;
  width: 200px;
  margin-right: 10px;
  padding: 5px;
`;

class Splitter extends React.Component {

  state = {
    NEW_BOB: '0',
    NEW_CAROL: '0',
    SEND_AMOUNT: 25,
  }

  sendFromAlice = async (amount) => {
    const result = await this.props.contract.sendTransaction({
      from: this.state.owner,
      value: this.props.web3.toWei(this.state.SEND_AMOUNT,'ether'),
    });
    console.log(result);
    this.checkAccounts(this.props.contract);
  }

  getBalance = async () => {
    const result = await this.props.contract.contract.warchest();
    const bobCash = await this.props.web3.eth.getBalance(this.state.bob);
    const carolCash = await this.props.web3.eth.getBalance(this.state.carol);
    this.setState({
      warchest: this.props.web3.fromWei(result.toNumber(), 'ether'),
      bobAmount: this.props.web3.fromWei(bobCash.toNumber(), 'ether'),
      carolAmount: this.props.web3.fromWei(carolCash.toNumber(), 'ether'),
    })
  }

  changeBobOrAlice = async () => {
    const bob_new = this.props.web3.toChecksumAddress(this.state.NEW_BOB.trim())
    const carol_new = this.props.web3.toChecksumAddress(this.state.NEW_CAROL.trim())
    const result = await this.props.contract
        .changeBobAndOrCarol(bob_new, carol_new, {from: this.state.owner});
    // We could also get the new addresses from the logs
    console.log(result);
    this.checkAccounts(this.props.contract);
  }

  componentDidMount(){
    this.checkAccounts(this.props.contract);
  }

  checkAccounts = async (contract) => {
    if (!contract) return;
    const owner = await contract.owner();
    const bob = await contract.bob();
    const carol = await contract.carol();
    // console.log({owner, bob, carol})
    this.setState({owner, bob, carol}, () => this.getBalance());
  }

  componentWillReceiveProps(props) {
    this.checkAccounts(props.contract);
  }

  render() {

    const {props} = this;

    console.log(this.state)

    if (!props.contract) return <div>Oops - Contract not loaded! </div>;

    return (<div>
      <h2>Splitter</h2>
      <Input onChange={(e) => this.setState({SEND_AMOUNT: e.target.value})} value={this.state.SEND_AMOUNT} /><Button
        onClick={() => this.sendFromAlice("50000000000000000000")}> Let's split it up </Button>
      {/*<Button onClick={() => this.getBalance()}> Check Balance </Button>*/}
      {/*<Button onClick={() => this.checkAccounts(this.props.contract)}> Check Accounts </Button>*/}
      <div><Input onChange={(e) => this.setState({NEW_BOB: e.target.value})}/><Button
          onClick={() => this.changeBobOrAlice()}>New Bob</Button></div>
      <div><Input onChange={(e) => this.setState({NEW_CAROL: e.target.value})}/><Button
          onClick={() => this.changeBobOrAlice()}>New Carol </Button></div>
      <p>Bob: {this.state.bob ? this.state.bob : 'Loading Address...'}
        - {this.state.bobAmount ? this.state.bobAmount + ' ETH' : 'Loading Balance...'}</p>
      <p>Carol: {this.state.carol ? this.state.carol : 'Loading Address...'}
        - {this.state.carolAmount ? this.state.carolAmount + ' ETH' : 'Loading Balance...'}</p>
    </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Splitter', 'contract']),
    accounts: state.settings.get('accounts'),
    web3: state.settings.get('web3'),
  }
}

export default connect(mapStateToProps)(Splitter);

