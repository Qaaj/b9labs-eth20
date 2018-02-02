import React from 'react'
import {connect} from 'react-redux';
import {changeProvider} from './redux/SettingsReducer';
import { Button } from './styles';

const Providers = (props) => {

    return (
        <div>
          <Button
              onClick={() => props.changeProvider('https://ropsten.infura.io/A6JlogMFVWgkE7v6pwMO')}>Connect to
            Ropsten</Button>
          <Button
              onClick={() => props.changeProvider('http://localhost:9545')}>TestRPC - localhost:9545</Button>
          <Button
              onClick={() => props.changeProvider('http://localhost:8545')}>Development - localhost:8545</Button>
          <Button
              onClick={() => props.changeProvider('http://52.39.44.21:8545')}>Amazon</Button>
          <Button
              onClick={() => props.changeProvider('injected')}>Injected web3</Button>
        </div>
    );
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeProvider: (url) => dispatch(changeProvider(url)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Providers);

