import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'
import {loadContracts} from './Contracts';
import Web3 from '../services/web3';

const { Types, Creators } = createActions({
  providerChanged: ['web3'],
})


export const INITIAL_STATE = {
};

export const providerChanged = (state, {web3}) => {
  return state.set('web3', web3);
}

export const changeProvider = (url) => (dispatch) => {
  Web3.get(url).then((web3) => {
     console.log('PROVIDER CHANGED:', web3);
     dispatch(Creators.providerChanged(web3));
     dispatch(loadContracts());
  });
}

export const reducer = (web3) => createReducer(fromJS({ ...INITIAL_STATE, web3 }), {
  [Types.PROVIDER_CHANGED]: providerChanged,
})

export const DefaultTypes = Types;

export default Creators;