import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'
import truffleContract from 'truffle-contract';

import Youtube from '../../build/contracts/Youtube.json';
import CrowdFunding from '../../build/contracts/CrowdFunding.json';
import Splitter from '../../build/contracts/Splitter.json';
import Remittance from '../../build/contracts/Remittance.json';

const { Types, Creators } = createActions({
  contractLoaded: ['contractName', 'contractInstance'],
  contractLoadFailed: ['contractName', 'error'],
  loadingContract: ['contractName'],
});


export const INITIAL_STATE = fromJS({
  Youtube: {
    json: Youtube
  },
  CrowdFunding: {
    json: CrowdFunding
  },
  Splitter: {
    json: Splitter
  },
  Remittance: {
    json: Remittance
  },
});

export const contractLoaded = (state, { contractName, contractInstance }) => {
  return state
      .setIn([contractName, 'isLoaded'], true)
      .setIn([contractName, 'error'], null)
      .setIn([contractName, 'contract'], contractInstance);
};

export const contractLoadFailed = (state, { contractName, error }) => {
  return state
      .setIn([contractName, 'error'], error)
};

export const loadingContract = (state, { contractName }) => {
  return state
      .setIn([contractName, 'isLoaded'], false)
};

export const loadContracts = () => (dispatch, getState) => {
  const contracts = getState().contracts.toJS();
  const web3 = getState().settings.get('web3');

  Object.keys(contracts).forEach(key => {

    const contract = contracts[key];

    dispatch(Creators.loadingContract(key));

    const contractInstance = truffleContract(contract.json);

    contractInstance.setProvider(web3.currentProvider);

    // Get accounts.
    web3.eth.getAccounts((error, accounts) => {
      contractInstance.deployed().then((instance) => {
        // instance.at(instance.address);
        dispatch(Creators.contractLoaded(key, instance));
      }).catch(error => {
        dispatch(Creators.contractLoadFailed(key, error.message))
      })
    });
  })
};

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONTRACT_LOADED]: contractLoaded,
  [Types.CONTRACT_LOAD_FAILED]: contractLoadFailed,
  [Types.LOADING_CONTRACT]: loadingContract,
});

export const ContractTypes = Types;

export default Creators;
