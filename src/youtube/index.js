import React from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';

import { requestNewVideo } from './reducer';


const Youtube = (props) => {

  console.log(props);

  return (<div>
    Youtube
  </div>);
}

const mapStateToProps = (state) => {
  return {
    contracts: state.contracts.get('Youtube'),
    video: state.youtube.get('latestVideo'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestNewVideo: (url,message) => dispatch(requestNewVideo(url, message)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Youtube);

