import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

const { Types, Creators } = createActions({
  newVideoReceived: ['video'],
  txReceiptReceived: ['txReceipt'],
  resetReceipt: null,
});

export const INITIAL_STATE = {
  latestVideo: {
    url: '',
    message: '',
  },

  txReceipt: null,

  /**txReceipt: {
    tx: "0x474ab9b37ef0dc9719ec4605a6b028a0b51d8c24296e8aa02a318ec7a8388f77",

    receipt: {
      blockHash: "0x9a718aac330e8d18bc34ce57d6cc2525dc7b243c87b3babdb7ba169234ee92b5",
      gasUsed: 130821,
      blockNumber: 6454654,
      to: "0x11af5cd5a0efc902c2e49672ead7fb72af1f0294",
      status: "0x1"
    }
  },

  txReceipt: null,**/
};

export const addSmartContractEventWatchers = (contractInstance) => async(dispatch) => {
  var LogVideoCreated = contractInstance.LogVideoCreated({}/**,{fromBlock: 0, toBlock: 'latest'}**/);

  LogVideoCreated.watch(function(err, result){
    if(!err){
      console.groupCollapsed(`Solidity Event: LogVideoCreated: ${Object.keys(result.args).length} args`);
      console.log('Owner: ' , result.args.by);
      console.log('URL: ' , result.args.URL);
      console.log('Message: ' , result.args.message);
      console.log('Video ID: ' , result.args.videoId.toString());
      console.groupEnd();

      return dispatch(Creators.newVideoReceived(result.args.URL, result.args.message));
    }else{
      console.log(err);
    }
  })
};

export const requestNewVideo = (params, contract, accounts) => async (dispatch) => {
  const payment = params.isCustomMessageAdded ? params.payment : 0;

  if(payment.isCustomMessageAdded){
    console.log('You payed ' , payment , 'wei for your custom message')
  }else{
    // Overwrite message (non-payed)
    params.message = "";
  }

  let txReceipt = await contract.requestVideo(params.url, params.message, {
    from: accounts[0],
    gas: 3000000,
    value: payment
  });

  dispatch(Creators.txReceiptReceived(txReceipt))

  var result = txReceipt.logs[0].args;

  dispatch(Creators.newVideoReceived(result.URL, result.message))
};

export const requestCurrentVideo = (contract) => async (dispatch) => {
  try{
    const lastVideoRequest = await contract.lastRequest();

    const message = lastVideoRequest[1];

    var video = {
      url : lastVideoRequest[0],
      message: message.length > 0 ? message : 'ETH.TV',
      from: lastVideoRequest[2]
    };

    dispatch(Creators.newVideoReceived(video))
  }catch(e){
    throw(e.message)
  }
};

export const requestTxReceipt = (web3, txHash) => async (dispatch) => {
  try{
    const txReceipt = await web3.eth.getTransactionReceipt(txHash);

    dispatch(Creators.txReceiptReceived(txReceipt))
  }catch(e){
    throw(e.message)
  }
};

export const deleteReceipt = (state) => async (dispatch) => {
  try{
    dispatch(Creators.resetReceipt());
  }catch(e){
    throw(e.message);
  }
};

export const newVideoReceived = (state, params) => {
  let { video } = params;
  let { url, message, from } = video;

  if(url && url !== state.getIn(['latestVideo', 'url'])){

    state = state.setIn(['latestVideo', 'message'], message);
    state = state.setIn(['latestVideo', 'from'], from);
    return state.setIn(['latestVideo','url'], url);
  }else{
    return state;
  }
};
export const txReceiptReceived = (state, params) => {
  const { txReceipt } = params;

  state = state.set('txReceipt', txReceipt);

  return state;
};

export const receiptWasReset = (state, params) => {
  state = state.set('txReceipt', null);

  return state;
};

export const reducer = createReducer(fromJS(INITIAL_STATE), {
  [Types.NEW_VIDEO_RECEIVED]: newVideoReceived,
  [Types.TX_RECEIPT_RECEIVED]: txReceiptReceived,
  [Types.RESET_RECEIPT]: receiptWasReset,
});

export const DefaultTypes = Types;

export default Creators;
