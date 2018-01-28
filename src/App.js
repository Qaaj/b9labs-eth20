import React, { Component } from 'react'
import {connect} from 'react-redux';
import {loadContracts} from './redux/Contracts';
import {changeProvider} from './redux/SettingsReducer';
import styled from 'styled-components';

const Contract = styled.div`
  padding: 10px;
`;

const Button = styled.div`
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
  background-color: #455A64;
  color: white;
  max-width: 300px; text-align: center;
  margin: 20px 5px;
`;

class App extends Component {


  constructor(props){
    super(props);
    props.loadContracts();
  }

  render() {

    const providerName = this.props.web3.currentProvider.constructor.name;

    const contractList = Object.keys(this.props.contracts).map(contractKey => {
      const contract = this.props.contracts[contractKey];
      if(contract.isLoading) return <Contract key={`contract-${contractKey}`}>⚙️Loading {contractKey}...</Contract>
      return <Contract key={`contract-${contractKey}`}> ✅{contractKey} finished loading. ({contract.contract.address})</Contract>
    })

    return (
        <div>
          <Button style={{cursor: 'pointer'}}
                  onClick={() => this.props.changeProvider('https://ropsten.infura.io/A6JlogMFVWgkE7v6pwMO')}>Connect to Ropsten</Button>
          <Button style={{cursor: 'pointer'}}
                  onClick={() => this.props.changeProvider('http://localhost:9545')}>Connect to localhost:9545</Button>
          <h1>Welcome to The Smart Contract Playground</h1>
          <h3>Currently connected via {providerName} </h3>
          {providerName === 'HttpProvider' && <h3>{this.props.web3.currentProvider.host}</h3>}
          <h3>Hold on while we load your deployed contracts:</h3>
          {contractList}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contracts: state.contracts.toJS(),
    web3: state.settings.get('web3'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadContracts: () => dispatch(loadContracts()),
    changeProvider: (url) => dispatch(changeProvider(url)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

