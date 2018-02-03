pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Splitter is Ownable{
  
  address public bob = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C;
  address public carol = 0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB;
  
  uint256 public warchest = 0;
  
  event MoneySent(address receiver, uint amount);
  event MoneyReceived(address sender, uint amount);
  event AddressesChanged(address bob, address carol);
  
  
  function Splitter() payable public {
    MoneyReceived(msg.sender, msg.value);
    warchest = msg.value;
  }
  
  function changeBobAndOrCarol(address newBob, address newCarol)
  onlyOwner
  public
  {
    require(newBob != address(0) || newCarol != address(0));
    if(newBob != address(0)) bob = newBob;
    if(newCarol != address(0)) carol = newCarol;
    AddressesChanged(bob,carol);
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
    warchest = this.balance;
  }
  
  function drainWarchest (address luckyPerson)
  public
  onlyOwner {
    require(luckyPerson != address(0));
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