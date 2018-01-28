import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'
import contract from 'truffle-contract';

import Youtube from '../../build/contracts/Youtube.json';

const { Types, Creators } = createActions({
  contractLoaded: ['contractName', 'contractInstance'],
  loadingContract: ['contractName'],
})


export const INITIAL_STATE = fromJS({
  Youtube: {
    isLoading: true,
    json: Youtube
  },
});

export const contractLoaded = (state, { data }) => {
  return state
      .setIn([data.contractName, 'isLoading'], false)
      .setIn([data.contractName, 'contract'], data.contractInstance);
}

export const loadingContract = (state, { contractName }) => {
  return state
      .setIn([contractName, 'isLoading'], true)
}

export const loadContracts = () => (dispatch, getState) => {

  const web3 = getState().settings.get('web3');

  dispatch(Creators.loadingContract('Youtube'));

  const simpleStorage = contract(Youtube)
  simpleStorage.setProvider(web3.currentProvider)

  // Declaring this for later so we can chain functions on SimpleStorage.
  var simpleStorageInstance;

  // Get accounts.
  web3.eth.getAccounts((error, accounts) => {
    simpleStorage.deployed().then((instance) => {
      simpleStorageInstance = instance;
      dispatch({ type: "CONTRACT_LOADED", data: { contractName: 'Youtube', contractInstance: simpleStorageInstance } });
    });
  });

}


export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONTRACT_LOADED]: contractLoaded,
  [Types.LOADING_CONTRACT]: loadingContract,
})

export const ContractTypes = Types;

export default Creators;