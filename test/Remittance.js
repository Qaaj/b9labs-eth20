require('chai').should();
// const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const web3 = new Web3();
const Remittance = artifacts.require('Remittance');
const helpers = require('../src/projects/remittance/helpers');

const sendAmount =  web3.toWei(0.10,'ether');

let remittance, api;

const cool_hash = '0x678c189fde5058554d934d6af17e41750fa2a94b61371c5ea958a7595e146324';
const beans_hash = '0xe246129de4a8a291c1d772650ceca0ebb56dd9996b985e6ce3e45a2e515cc577';

contract('Remittance', accounts => {

  beforeEach("deploy new Remittance", async () =>  {
    remittance = await Remittance.new({ from: alice });
    api = helpers.api(remittance);
  });

  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  it('should deploy the contract', async () => {
    remittance.contract.owner().should.eql(alice)
  });

  it('should hash passwords correctly', async () => {
    const cool = await api.hashPassword('cool');
    const beans = await api.hashPassword('beans');
    cool.should.eql(cool_hash);
    beans.should.eql(beans_hash);
  });

  it('should create a new Remittance Project', async () => {
    const blockHeight = await remittance.contract.blockHeight({from:alice});
    const password_one = await api.hashPassword(Math.round(Math.random()*1000000).toString());
    const password_two = await api.hashPassword(Math.round(Math.random()*1000000).toString());
    const logs =  await api.newProject(password_one, password_two, blockHeight.toNumber() + 100, { from: alice, value: sendAmount});
    const log = helpers.getLog('LogRemittanceCreated',logs);
    log.args.owner.should.eql(alice);
    log.args.instanceId.toString().should.eql("1");
  });

  it('should not create a new Remittance Project when deadline is over allowed max blockheight', async () => {
    const blockHeight = await remittance.contract.blockHeight({from:alice});
    const maxDeadlineHeight = await remittance.contract.maxDeadlineHeight({from:alice});
    const password_one = await api.hashPassword(Math.round(Math.random()*1000000).toString());
    const password_two = await api.hashPassword(Math.round(Math.random()*1000000).toString());
    try {
      await api.newProject(password_one, password_two, blockHeight + maxDeadlineHeight + 1, { from: alice, value: sendAmount});
    } catch (error) {
      assert(true);
      return;
    }
    assert.fail('Expected throw not received');
  });

});
