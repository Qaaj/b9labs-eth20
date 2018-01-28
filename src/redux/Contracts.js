import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'
import contract from 'truffle-contract';

import CrowdFunding from '../../build/contracts/CrowdFunding.json';

const { Types, Creators } = createActions({
  loadContracts: ['web3'],
  contractLoaded: ['contractName', 'contractInstance'],
})


export const INITIAL_STATE = fromJS({
  CrowdFunding: {
    isLoading: true,
    json: CrowdFunding
  },
});

export const contractLoaded = (state, { data }) => {
  return state
      .setIn([data.contractName, 'isLoading'], false)
      .setIn([data.contractName, 'contract'], data.contractInstance);
}

export const loadContracts = () => (dispatch, getState) => {

  const web3 = getState().settings.web3;

  const simpleStorage = contract(CrowdFunding)
  simpleStorage.setProvider(web3.currentProvider)

  // Declaring this for later so we can chain functions on SimpleStorage.
  var simpleStorageInstance;

  // Get accounts.
  web3.eth.getAccounts((error, accounts) => {
    simpleStorage.deployed().then((instance) => {
      simpleStorageInstance = instance;
      dispatch({ type: "CONTRACT_LOADED", data: { contractName: 'CrowdFunding', contractInstance: simpleStorageInstance } });
    });
  });

}


export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_CONTRACTS]: loadContracts,
  [Types.CONTRACT_LOADED]: contractLoaded,
})

export const ContractTypes = Types;

export default Creators;