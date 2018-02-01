import React from 'react';
import { connect } from 'react-redux';
import { Button } from '../../styles/index';

const Splitter = (props) => {

  if(!props.contract) return <div>Oops - Contract not loaded! </div>;
  return (<div>
    <h2>Splitter</h2>
    <Button> Let's split it up </Button>
  </div>);
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Splitter','contract']),
    accounts: state.settings.get('accounts'),
  }
}

export default connect(mapStateToProps)(Splitter);

