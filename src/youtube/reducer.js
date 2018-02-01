import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

const { Types, Creators } = createActions({
  requestNewVideo: ['url', 'message'],
  newVideoReceived: ['url', 'message'],
});

export const INITIAL_STATE = {
  latestVideo: {
    url: null,
    message: null,
  }
};

export const newVideoReceived = (state, { web3 }) => {
  return state.set('web3', web3);
}

export const requestNewVideo = (url) => (dispatch,getState) => {
  console.log(getState());
}

export const reducer = createReducer(fromJS({ INITIAL_STATE }), {
  [Types.NEW_VIDEO_RECEIVED]: newVideoReceived,
})

export const DefaultTypes = Types;

export default Creators;