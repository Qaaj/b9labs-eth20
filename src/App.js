import React, { Component } from 'react'
import { connect } from 'react-redux';
import { loadContracts } from './redux/Contracts';
import { loadAccounts } from './redux/SettingsReducer';
import Providers from './Providers';
import styled from 'styled-components';

import Youtube from './projects/youtube'
import Splitter from './projects/splitter'
import Remittance from './projects/remittance'

import { Button } from './styles';

const Container = styled.div`
  color: white;
  padding: 2em;
`;

const Contract = styled.div`
  padding: 10px;
`;

const Red = styled.span`
  color: red;
`;

const CloseButton = styled.div`
  padding: 10px;
  position: fixed;
  top: 0px;
  right: 0px;
  cursor: pointer;
  font-size: 20px;
  z-index: 99999;
`;

class App extends Component {

  state = { component: null };
  // state = { component: 'eth.tv' };

  constructor(props) {
    super(props);
    props.loadContracts();
    props.loadAccounts(props.web3);
  }

  render() {

    const providerName = this.props.web3.currentProvider.constructor.name;

    const contractList = Object.keys(this.props.contracts).map(contractKey => {
      const contract = this.props.contracts[contractKey];
      if (contract.isLoaded) return <Contract key={`contract-${contractKey}`}> ✅{contractKey} finished loading.
        ({contract.contract.address})</Contract>
      if (contract.error) return <Contract key={`contract-${contractKey}`}> ⚠️{contractKey} -
        <Red>{contract.error}</Red></Contract>
      return <Contract key={`contract-${contractKey}`}>⚙️Loading {contractKey}...</Contract>
    });

    if(this.state.component){
      let component;
      if (this.state.component === 'eth.tv') component = <Youtube />;
      if (this.state.component === 'splitter') component = <Splitter />;
      if (this.state.component === 'remittance') component = <Remittance />;
      return (<div>
        {component}
        <CloseButton onClick={()=>this.setState({component: null})}>❌</CloseButton>
      </div>);
    }

    return (
        <Container>
          <Providers />
          <h1>Welcome to The Smart Contract Playground</h1>
          <h3>Currently connected via {providerName} {providerName === 'HttpProvider' &&
          <span> - {this.props.web3.currentProvider.host}</span>}</h3>
          <h2>Contracts</h2>
          {contractList}
          <h2>Projects</h2>
          <Button onClick={() => this.setState({ component: 'splitter' })}>Splitter</Button>
          <Button onClick={() => this.setState({ component: 'eth.tv' })}>ETH.TV</Button>
          <Button onClick={() => this.setState({ component: 'remittance' })}>Remittance</Button>
        </Container>
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
    loadAccounts: (web3) => dispatch(loadAccounts(web3)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

