import {combineReducers} from 'redux'
import configureStore from './createStore'

export default (web3) => {


  const rootReducer = combineReducers({
    settings: require('./SettingsReducer').reducer(web3),
    contracts: require('./Contracts').reducer,
  });

  return configureStore(rootReducer)
}