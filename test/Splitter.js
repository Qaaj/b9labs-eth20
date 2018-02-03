require('chai').should();
// const BigNumber = require('bignumber.js');
var Splitter = artifacts.require('Splitter');


const splitter = async () => {
  return await Splitter.new()
}

contract('Splitter', accounts => {

  const bob = accounts[0];
  const alice = accounts[0];
  const carol = accounts[0];

  it('should deploy the contract', async () => {
    const cf = await splitter();
    // Bob initially deployed the contract
    cf.contract.owner().should.eql(bob)
  });

})
