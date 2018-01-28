import React, { Component } from 'react'
import {connect} from 'react-redux';
import {loadContracts} from './redux/Contracts';


class App extends Component {

  constructor(props){
    super(props);
    props.loadContracts();
  }

  render() {

    const contractList = Object.keys(this.props.contracts).map(contractKey => {
      const contract = this.props.contracts[contractKey];
      if(contract.isLoading) return <div key={`contract-${contractKey}`}>Loading {contractKey}...</div>
      return <div key={`contract-${contractKey}`}>{contractKey} finished loading.</div>
    })

    return (
        <div>
          <h1>Welcome to The Smart Contract Playground</h1>
          <h3>Hold on while we load your deployed contracts:</h3>
          {contractList}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contracts: state.contracts.toJS(),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadContracts: () => dispatch(loadContracts()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

