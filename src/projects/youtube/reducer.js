import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

const { Types, Creators } = createActions({
  newVideoReceived: ['url', 'message'],
});

export const INITIAL_STATE = {
  latestVideo: {
    url: '',
    message: '',
  }
};

export const newVideoReceived = (state, params) => {
  let { url, message } = params;

  console.log('Polling... ');

  if(url && url !== state.getIn(['latestVideo', 'url'])){
    //console.log('New video received ' , params);

    // TODO: Add message
    state = state.setIn(['latestVideo', 'message'], 'Hi! I hope you like my video!');

    return state.setIn(['latestVideo','url'], url);
  }else{
    return state;
  }
};

export const requestNewVideo = (URL, message, contract, accounts) => async (dispatch) => {
  await contract.requestVideo(URL || '', message, {from: accounts[0], gas: 3000000});
  const url = await contract.lastURL();
  dispatch(Creators.newVideoReceived(url))
}

export const requestCurrentVideo = (contract) => async (dispatch) => {
  try{
    const url = await contract.lastURL();
    dispatch(Creators.newVideoReceived(url))
  }catch(e){
    throw(e.message)
  }
};

export const reducer = createReducer(fromJS(INITIAL_STATE), {
  [Types.NEW_VIDEO_RECEIVED]: newVideoReceived,
})

export const DefaultTypes = Types;

export default Creators;
