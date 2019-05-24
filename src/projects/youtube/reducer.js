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
      const from = result.args.by;
      const url = result.args.URL;
      const message = result.args.message;
      const id = result.args.videoId.toString()

      console.log(result);
      console.groupCollapsed(`Solidity Event: LogVideoCreated: ${Object.keys(result.args).length} args`);
      console.log('Owner: ' , from);
      console.log('URL: ' , url);
      console.log('Message: ' , message);
      console.log('Video ID: ' , id);
      console.groupEnd();

      const newVideo = {
        from,
        url,
        message,
        id,
      };

      return dispatch(Creators.newVideoReceived(newVideo));
    }else{
      console.log(err);
    }
  })
};

export const requestNewVideo = (params, contract, accounts) => async (dispatch) => {
  const FROM = accounts[0];

  const payment = params.isCustomMessageAdded ? params.payment : 0;

  if(params.isCustomMessageAdded){
    //console.log('You payed ' , payment , 'wei for your custom message', params.message)
  }else{
    // Overwrite message (non-payed)
    params.message = "";
  }

  let txReceipt = await contract.requestVideo(params.url, params.message, {
    from: accounts[0],
    gas: 3000000,
    value: payment
  });

  var result = txReceipt.receipt;

  // Shows the receipt
  dispatch(Creators.txReceiptReceived({
    from: FROM,
    url: params.URL,
    message: params.message,
    id: result.videoId || "0x0",

    tx: txReceipt.tx,
    blockHash: result.blockHash,
    gasUsed: result.gasUsed,
    cumulativeGasUsed: result.cumulativeGasUsed,
    status: result.status
  }));
};

export const requestCurrentVideo = (contract) => async (dispatch) => {
  try{
    const lastVideoRequest = await contract.lastRequest();

    // TODO: What if no first video has been requested yet?

    const message = lastVideoRequest[1];

    var video = {
      url : lastVideoRequest[0],
      message: message.length > 0 ? message : 'ETH.TV',
      from: lastVideoRequest[2]
    };

    if(video.url.length > 0){
      dispatch(Creators.newVideoReceived(video));
    }
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
  console.log(params);
  let { video } = params;
  let { url, message, from, tx } = video;

  if(url && url !== state.getIn(['latestVideo', 'url'])){
    // TODO: Improve this
    state = state.setIn(['latestVideo', 'message'], message);
    state = state.setIn(['latestVideo', 'from'], from);
    state = state.setIn(['latestVideo', 'tx'], tx);

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
