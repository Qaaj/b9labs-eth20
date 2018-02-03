pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Splitter is Ownable{
  
  address bob = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;
  address alice = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C;
  address carol = 0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB;
  
  function Splitter()
  public
  {
  }
  
  function splitFunds()
  payable
  public
  returns(bool success){
    return true;
  }
  
  function warChest()
  public
  constant
  returns (uint256 balance)
  {
    return this.balance;
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
    this.splitFunds();
  }
  
}