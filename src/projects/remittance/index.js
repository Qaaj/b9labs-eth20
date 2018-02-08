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
  }

  render() {

    const {props} = this;

    if (!props.contract) return <div>Oops - Contract not loaded! </div>;

    console.log(props.contract);

    return (<div>
      <h2>Remittance</h2>
      <Input onChange={(e) => {}} /><Button
        onClick={()=>{}}> Placeholder </Button>
    </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Remittance', 'contract']),
    accounts: state.settings.get('accounts'),
    web3: state.settings.get('web3'),
  }
}

export default connect(mapStateToProps)(Splitter);

