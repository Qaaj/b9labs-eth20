pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Splitter is Ownable{
  
  event LogMoneySplit(address sender,address bob, address carol, uint amount);
  event LogBalanceWithdraw(address benificiary, uint amount);
  event LogPaused(address sender, bool paused);
  
  bool public paused;
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
    require(bob != address(0));
    require(carol != address(0));
    uint amount = SafeMath.div(msg.value,2); // Calculate the amounts that are owed
    balances[bob] += amount; // Save the amounts owed
    balances[carol] += (msg.value - amount);
    LogMoneySplit(msg.sender, bob, carol, msg.value);
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
    return true;
  }
  
  function setPaused(bool value)
  onlyOwner
  public
  returns (bool isPaused)
  {
    require(value != paused);
    paused = value;
    LogPaused(msg.sender, paused);
    return paused;
  }
}