import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

const { Types, Creators } = createActions({
  trades: ['data'],
  connection: [],
})


export const INITIAL_STATE = fromJS({
  trades: [],
  connected: true,
});


export const handleConnection = (state) => {
  return state;
}

export const showTrades = (state, { data }) => {
  return state.set('trades', fromJS([data]));
}


export const reducer = createReducer(INITIAL_STATE, {
  [Types.TRADES]: showTrades,
  [Types.CONNECTION]: handleConnection,
})

export const DefaultTypes = Types;

export default Creators;