import React from 'react';
import { connect } from 'react-redux';
// import ReactPlayer from 'react-player';
import { Button } from '../styles';
// import styled from 'styled-components';

import { requestNewVideo } from './reducer';

const setURL =  async (contract, accounts) => {
  await contract.requestVideo(Math.round(Math.random()*100000).toString(), 'Please like my video', {from: accounts[0], gas: 3000000});
  const url2 = await contract.lastURL();
  console.log(url2);
}
const getURL =  async (contract, accounts) => {
  const url = await contract.lastURL();
  console.log(url);
}

const Youtube = (props) => {

  return (<div>
    <h2>Youtube</h2>
    <Button onClick={()=> getURL(props.contract,props.accounts)}> Get the URL </Button>
    <Button onClick={()=> setURL(props.contract,props.accounts)}> Set Random URL</Button>
  </div>);
}

const mapStateToProps = (state) => {
  return {
    contract: state.contracts.getIn(['Youtube','contract']),
    accounts: state.settings.get('accounts'),
    video: state.youtube.get('latestVideo'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNewVideo: (url,message) => dispatch(requestNewVideo(url, message)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);

