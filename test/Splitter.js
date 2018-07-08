require('chai').should();
// const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const web3 = new Web3();
const Splitter = artifacts.require('Splitter');
const helpers = require('../src/projects/splitter/helpers');

const sendAmount =  web3.toWei(0.10,'ether');
const owedAmount =  web3.toWei(0.05,'ether');

let splitter, api;

contract('Splitter', accounts => {

  beforeEach("deploy new Splitter", async () =>  {
    splitter = await Splitter.new({ from: alice });
    api = helpers.api(splitter);
  });

  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  it('should deploy the contract', async () => {
    splitter.contract.owner().should.eql(alice)
  });

  it('should send money to the splitter contract', async () => {

    const result = await api.splitFunds(alice, bob, carol, sendAmount);
    const log = helpers.getLog('LogMoneySplit',result);

    log.args.sender.should.eql(alice);
    log.args.amount.toString().should.eql(sendAmount);

  });

  it('should update the owed balances correctly', async () => {
    await api.splitFunds(alice, bob, carol, sendAmount);
    const result = await api.getBalance(bob); // Bobs should have 0.05 ETH in his balance
    result.toString().should.eql(owedAmount);
  });

  it('should be able to withdraw owed balance', async () => {
    await api.splitFunds(alice, bob, carol, sendAmount);
    const result = await api.withdrawBalance(bob); // Bobs should have 0.05 ETH in his balance
    const log = helpers.getLog('LogBalanceWithdraw',result);

    log.args.benificiary.should.eql(bob);
    log.args.amount.toString().should.eql(owedAmount);
  });

  it('owner should be able to pause the contract', async () => {
    const result  = await api.pauseContract(alice, true);
    const log =  helpers.getLog('LogPaused',result);

    log.args.sender.should.eql(alice);
    log.args.paused.should.eql(true);
  });

});
