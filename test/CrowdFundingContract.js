require('chai').should();
const web3 = require('web3');
// var BigNumber = require('bignumber.js');
var CrowdFunding = artifacts.require('CrowdFunding');

const crowdfunding = async () => {
  return await CrowdFunding.new()
}

return true;

contract('Crowdfunding', accounts => {


  it('should deploy the contract', async () => {
    const cf = await crowdfunding()
    cf.contract.owner().should.eql(accounts[0])
  });

  it('should create a new campaign', async () => {
    const cf = await crowdfunding()
    const campaignId = await cf.newCampaign.call('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 100000, 'Cool Beans');
    campaignId.toNumber().should.eql(0)
  });

  it('should save the correct parameters for a new Campaign', async () => {

    const cf = await crowdfunding();
    await cf.newCampaign('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 100000, 'Cool Beans');

    const campaigns = await cf.campaigns;
    const campaign = await campaigns.call(0);

    campaign[0].toUpperCase().should.eql('0x627306090abaB3A6e1400e9345bC60c78a8BEf57'.toUpperCase());
    campaign[1].should.eql('Cool Beans');
    campaign[2].toNumber().should.eql(100000);

  });

  it('Should add one contributer to the campaign', async () => {

    const donateAddress = accounts[1];

    const cf = await crowdfunding();
    await cf.newCampaign('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 100000, 'Cool Beans');
    await cf.contribute(0, {from: donateAddress, value: 66666});

    const campaigns = await cf.campaigns;
    const campaign = await campaigns.call(0);

    campaign[3].toNumber().should.eql(1); // 1 Funder
    campaign[4].toNumber().should.eql(66666); // Total Amount sent

    const amount = await cf.getCampaignFunderByAddress.call(0,donateAddress);
    amount.toNumber().should.eql(66666); // Amount sent by one user

    // TODO: Figure out how to query funders inside campaign object - most likely not possible
    // console.log(campaign);
    // https://medium.com/@robhitchens/enforcing-referential-integrity-in-ethereum-smart-contracts-a9ab1427ff42
    // https://medium.com/@robhitchens/solidity-crud-part-1-824ffa69509a
  })

  it('Should add multiple contributers to the campaign', async () => {

    const donateAddressOne = accounts[1];
    const donateAddressTwo = accounts[2];

    const cf = await crowdfunding();
    await cf.newCampaign('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 100000, 'Cool Beans');
    await cf.contribute(0, {from: donateAddressOne, value: 14400});
    await cf.contribute(0, {from: donateAddressTwo, value: 66600});

    const campaigns = await cf.campaigns;
    const campaign = await campaigns.call(0);

    campaign[3].toNumber().should.eql(2); // 2 Funders
    campaign[4].toNumber().should.eql(14400+66600); // Total Amount sent

    const amount = await cf.getCampaignFunderByAddress.call(0,donateAddressTwo);

    amount.toNumber().should.eql(66600); // Amount sent by one user

  })

})
