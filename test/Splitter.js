require('chai').should();
const web3 = require('web3');
const BigNumber = require('bignumber.js');
var Splitter = artifacts.require('Splitter');

const splitter = async () => {
  return await Splitter.new()
}

contract('Splitter', accounts => {

  it('should deploy the contract', async () => {
    const cf = await splitter()
    cf.contract.owner().should.eql(accounts[0])
  });

})
