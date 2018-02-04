pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Splitter is Ownable{
  
  event LogMoneyAddded(address sender, uint amount);
  event LogBalanceWithdraw(address benificiary, uint amount);
  event LogFundsDrained(address benificiary, uint amount);
  event LogPaused(address sender, bool paused);
  
  bool public paused = false;
  uint public numAddresses;
  
  mapping (uint => address) addresses;
  mapping (address => uint) public balances;
  
  function Splitter() public {
  }
  
  function splitFunds(address bob, address carol)
  payable
  public
  returns (bool success)
  {
    require(!paused); // Contract is in operation
    require(msg.value > 0); // There is actually ETH sent
    require(bob != address(0) && carol != address(0)); // Make sure there are 2 benificiairies
    LogMoneyAddded(msg.sender, msg.value);
    uint amount = SafeMath.div(msg.value,2); // Calculate the amounts that are owed
    balances[bob] = amount; // Save the amounts owed
    balances[carol] = amount;
    addresses[numAddresses] = bob; // Save a list of benificiairies for when we want to empty them
    numAddresses++;
    addresses[numAddresses] = carol;
    numAddresses++;
    return true;
  }
  
  function withdraw()
  public
  returns (bool successful)
  {
    require(!paused); // Contract is in operation
    uint balance = balances[msg.sender]; // Get funds for sender
    require(balance != 0); // Make sure there is something to send
    bool success = msg.sender.send(balance); // Assert that transfer is succesful
    require(success);
    LogBalanceWithdraw(msg.sender, balance);
    delete balances[msg.sender]; // Remove the sender from our mapping
    uint n = numAddresses;
    uint i = 0;
    while (i <= n) {  // Find the sender in our list of benificiairies
      address a = addresses[i];
      if(a == msg.sender){
        delete addresses[i]; // Remove the sender from our list of benificiairies
        numAddresses--;
      }
      i++;
    }
    
    return true;
  }
  
  function drainFunds (address luckyPerson)
  onlyOwner
  public
  {
    require(luckyPerson != address(0));
    uint n = numAddresses;
    uint i = 0;
    while (i <= n) { // Loop over all benificiairies
      address a = addresses[i];
      delete balances[a]; // Delete their balances
      delete addresses[i]; // Delete them from the list of benificiairies
      i++;
    }
    numAddresses = 0;
    bool success = luckyPerson.send(this.balance);
    require(success);
    LogFundsDrained(luckyPerson, this.balance);
  }
  
  function setPaused(bool value)
  onlyOwner
  public
  returns (bool isPaused)
  {
    paused = value;
    LogPaused(msg.sender, paused);
    return paused;
  }
}