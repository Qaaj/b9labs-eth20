import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

const { Types, Creators } = createActions({
  newVideoReceived: ['url', 'message'],
});

export const INITIAL_STATE = {
  latestVideo: {
    url: null,
    message: null,
  }
};

export const newVideoReceived = (state, { url, message }) => {
  return state.setIn(['latestVideo','url'], url);
}

export const requestNewVideo = (URL, message, contract, accounts) => async (dispatch) => {
  await contract.requestVideo(URL || '', 'Please like my video', {from: accounts[0], gas: 3000000});
  const url = await contract.lastURL();
  dispatch(Creators.newVideoReceived(url))
}

export const requestCurrentVideo = (contract) => async (dispatch) => {
  const url = await contract.lastURL();
  dispatch(Creators.newVideoReceived(url))
}

export const reducer = createReducer(fromJS(INITIAL_STATE), {
  [Types.NEW_VIDEO_RECEIVED]: newVideoReceived,
})

export const DefaultTypes = Types;

export default Creators;