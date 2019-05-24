pragma solidity ^0.4.24;


/* The parent contract managing the list of active brokers and POAToken contracts.
 */


contract CrowdFunding {


  /* Struct  for Funder  */
  struct Funder {
    address addr;
    uint amount;
  }
  // Campaign data structure
  struct Campaign {
    address beneficiary;
    string name;
    uint fundingGoal;
    uint numFunders;
    uint amount;
    mapping (uint => Funder) funders;
  }
  //Declares a state variable 'numCampaigns'
  uint numCampaigns;

  address public owner;
  //Creates a mapping of Campaign datatypes
  mapping (uint => Campaign) public campaigns;

  event Changed(address a);

  event CampaignCreated(uint campaignId, address creator);

  function () public {
    owner = msg.sender;
  }

  function getCampaignFunderByAddress(uint campaignId, address funderAddr)
  view
  public returns (uint amount) {
    Campaign storage c = campaigns[campaignId];
    uint i = 0;
    uint f = c.numFunders;
    while (i <= f) {
      if (c.funders[i].addr == funderAddr) {
        return c.funders[i].amount;
      }
      i++;
    }
    assert(false);
  }

  /* first function sets up a new campaign */
  function newCampaign(address beneficiary, uint goal, string name) public returns (uint campaignID) {
    campaignID = numCampaigns++;
    // campaignID is return variable
    Campaign storage c = campaigns[campaignID];
    // assigns reference
    emit CampaignCreated(campaignID, msg.sender);
    c.beneficiary = beneficiary;
    c.fundingGoal = goal;
    c.name = name;
    return campaignID;
  }

  // function to contributes to the campaign
  // Line 1: function is defined as taking a single argument campaignID – it has no return value.
  // Line 2 and 3: Creates references to locations in storage to store a new funder *and* iterates the number of contributors.
  // Line 4,5, and 6: here we take the amount of ether passed with the contributors transaction and the public address of
  // the msg.sender and use it record the contribution from this transactions

  function contribute(uint campaignID) public payable {
    Campaign storage c = campaigns[campaignID];
    Funder storage f = c.funders[c.numFunders++];
    assert((c.amount + msg.value) <= c.fundingGoal);
    f.addr = msg.sender;
    f.amount = msg.value;
    c.amount += f.amount;
    checkGoalReached(campaignID);
  }
  // checks if the goal or time limit has been reached and ends the campaign
  function checkGoalReached(uint campaignID) private returns (bool reached) {
    Campaign storage c = campaigns[campaignID];
    if (c.amount >= c.fundingGoal) {
      uint i = 0;
      uint f = c.numFunders;
      c.beneficiary.transfer(c.amount);
      c.amount = 0;
      c.beneficiary = 0;
      c.fundingGoal = 0;
      c.numFunders = 0;
      while (i <= f) {
        c.funders[i].addr = 0;
        c.funders[i].amount = 0;
        i++;
      }
      return true;
    }
    return false;
  }
}