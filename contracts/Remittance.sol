pragma solidity 0.4.24;

import './Ownable.sol';

contract Remittance is Ownable {

  event LogRemittanceClaimed(address claimer, bytes32 instanceId, uint amount);
  event LogRemittanceCreated(address owner, uint amount, bytes32 instanceId, uint fee);
  event LogRemittanceCancelled(address remittanceInstanceOwner, bytes32 instanceId);
  event LogKillswitch(address receiver, uint amount);
  event LogPaused(address sender, bool paused);

  mapping (bytes32 => RemittanceInstance) public remittances;

  // Current estimate of contract creation cost
  uint contractCreationGasCost = 2000000;
  // Maximum amount of blocks after which remittance owner can withdraw
  uint public maxDeadlineHeight = 1000;
  // Profit ready for withdrawal
  uint public bankroll;

  bool paused;
  modifier pausable{
    require(!paused);
    _;
  }

  struct RemittanceInstance {
    address owner;
    bytes32 passphrase; // Hashed password_one
    uint amount; // Amount of eth
    uint deadlineBlock; //  BlockHeight after which amount is reclaimable
  }

  function () public {
    owner = msg.sender;
  }

  // Person B can then claim the funds with both passwords
  function claimFunds(bytes32 identifier, bytes password)
  pausable
  public
  {
    // Get the remittanceInstance from our mapping by name
    RemittanceInstance storage instance = remittances[identifier];
    // Make sure there is a instance under that name AND that there is still money to be sent
    require(instance.amount != 0);
    // We need the second hashed password to match plus the senders address
    require(instance.passphrase == keccak256(
      abi.encodePacked(msg.sender,keccak256(password))
    )
    );

    emit LogRemittanceClaimed(msg.sender, identifier, instance.amount);
    // Save the amount to be sent in a seperate variable
    uint amountToSend = instance.amount;
    // Clear the instance amount
    instance.amount = 0;
    // Finally, transfer the amount to the person claiming it
    msg.sender.transfer(amountToSend);
  }

  // Owner of a project can cancel the remittance up until a certain point
  function cancelProject(bytes32 identifier)
  public
  pausable
  {
    // Get the instance from our mapping by name
    RemittanceInstance storage instance = remittances[identifier];
    require(instance.owner == msg.sender);
    // After the deadline block, owner can claim funds
    require(instance.deadlineBlock >= block.number);
    emit LogRemittanceCancelled(instance.owner, identifier);
    // Save the amount to be sent in a seperate variable
    uint amountToSend = instance.amount;
    // Clear the instance amount
    instance.amount = 0;
    // Finally, transfer the amount to the owner
    msg.sender.transfer(amountToSend);
  }

  // Create a new Remittance project
  function newProject(bytes32 passphrase,  address claimer, uint deadlineBlock)
  public
  pausable
  payable
  returns (bytes32 identifier)
  {
    // Deadline can't be further away than the max Deadline BlockHeight
    require((deadlineBlock - block.number) < maxDeadlineHeight);
    // There needs to be something to remit
    require(msg.value > 0);
    // Create new Project struct
    bytes32 finalHash = keccak256(abi.encodePacked(claimer,passphrase));
    // Calculate current fee based on gasprice
    uint fee = tx.gasprice * 1000000 * contractCreationGasCost;
    // Add fee to the bankroll
    bankroll += fee;
    // Gotta pay taxes
    uint amountToSend = msg.value - fee;
    require(amountToSend > 0);

    RemittanceInstance memory remittanceInstance =
    RemittanceInstance(
      {owner: msg.sender,
      passphrase: finalHash,
      amount: amountToSend,
      deadlineBlock: deadlineBlock
      });

    remittances[passphrase] = remittanceInstance;
    emit LogRemittanceCreated(msg.sender, amountToSend, passphrase, fee);
    return passphrase;
  }

  // Emergency function to drain all funds from the contract and pauses it
  function panicButton(address emergencyExit)
  public
  only_owner
  {
    if(emergencyExit != address(0))
    {
      emit LogKillswitch(emergencyExit, address(this).balance);
      emergencyExit.transfer(address(this).balance);
    }else{
      emit LogKillswitch(msg.sender, address(this).balance);
      msg.sender.transfer(address(this).balance);
    }
  }

  // Drain the bankroll
  function takeProfits()
  only_owner
  public
  {
    require(msg.sender == owner);
    uint toSend = bankroll;
    bankroll = 0;
    owner.transfer(toSend);
  }

  function setPaused(bool value)
  only_owner
  public
  returns (bool isPaused)
  {
    require(value != paused);
    paused = value;
    emit LogPaused(msg.sender, paused);
    return paused;
  }

  // Helper functions

  function blockHeight()
  public
  view
  returns(uint blockheight)
  {
    uint height = block.number;
    return height;
  }

  function gasPrice()
  public
  view
  returns(uint gasprice)
  {
    return (tx.gasprice * 1000000);
  }

  function hashPassword(bytes password)
  public
  pure
  returns(bytes32 hash)
  {
    return keccak256(password);
  }

}