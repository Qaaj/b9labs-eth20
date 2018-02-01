import React from 'react';
import { connect } from 'react-redux';
import { Button } from '../styles';
// import styled from 'styled-components';

import { requestNewVideo } from './reducer';

const doStuff = (contract) => {
  console.log(contract);
}

const Youtube = (props) => {
  return (<div>
    <h2>Youtube</h2>
    <Button onClick={()=> doStuff(props.contract)}> Do Something Amazing</Button>
  </div>);
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Youtube','contract']),
    video: state.youtube.get('latestVideo'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNewVideo: (url,message) => dispatch(requestNewVideo(url, message)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);

