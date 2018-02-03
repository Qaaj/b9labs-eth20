pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Splitter is Ownable{
  
  address alice = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;
  address bob = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C;
  address carol = 0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB;
  
  uint256 public warchest = 0;
  
  event MoneySent(address a, uint amount);
  event MoneyReceived(address a, uint amount);
  
  
  function Splitter() payable public {
    MoneyReceived(msg.sender, msg.value);
    warchest = msg.value;
  }
  
  function splitFunds(uint amount)
  private
  {
    MoneyReceived(msg.sender, msg.value);
    warchest = warchest + amount;
    uint sendAmount = SafeMath.div(warchest,2);
    bob.transfer(sendAmount);
    MoneySent(bob, sendAmount);
    carol.transfer(sendAmount);
    MoneySent(carol, sendAmount);
  }
  
  function drainWarchest (address luckyPerson)
  public
  onlyOwner {
    require(luckyPerson != 0x0);
    luckyPerson.transfer(this.balance);
  }
  
  function killMe()
  onlyOwner
  public {
    selfdestruct(owner);
  }
  
  function ()
  public
  payable {
    require(msg.value != 0);
    splitFunds(msg.value);
  }
}