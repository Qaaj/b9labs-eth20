pragma solidity 0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

pragma solidity 0.4.18;

import './Ownable.sol';

contract Remittance is Ownable {

    event LogProjectClaimed(address claimer, uint instanceId, uint feePaid);
    event LogProjectCreated(address owner, uint amount, uint instanceId);
    event LogProjectCancelled(address remittanceInstanceOwner, uint instanceId);
    event LogKillswitch(address receiver, uint amount);
    event LogPaused(address sender, bool paused);

    mapping (uint => RemittanceInstance) public remittances;

    // Current estimate of contract creation cost
    uint contractCreationGasCost = 2000000;
    uint remittanceInstanceCount;
    bool paused;
    // Maximum amount of blocks after which remittance owner can withdraw
    uint maxDeadlineHeight = 1000;

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

    function Remittance() public {
        owner = msg.sender;
    }

    function gasPrice()
    public
    view
    returns(uint gasprice)
    {
        return (tx.gasprice * 1000000);
    }

    function claimMoney(uint instanceId, string password_one, string password_two)
    pausable
    public
    {
        // Get the remittanceInstance from our mapping by name
        RemittanceInstance storage instance = remittances[instanceId];
        // Make sure there is a instance under that name AND that there is still money to be sent
        require(instance.amount != 0);
        // We need the hashed passwords to match
        require(instance.passphrase == keccak256(keccak256(password_one),keccak256(password_two)));
        uint fee = tx.gasprice * 1000000 * contractCreationGasCost;
        LogProjectClaimed(msg.sender, instanceId, fee);
        // Save the amount to be sent in a seperate variable
        uint amountToSend = instance.amount;
        // Gotta pay taxes
        amountToSend = amountToSend - fee;
        // Clear the instance amount
        instance.amount = 0;
        // Finally, transfer the amount to the person claiming it
        msg.sender.transfer(amountToSend);
    }

    function cancelProject(uint instanceId)
    public
    pausable
    {
        // Get the instance from our mapping by name
        RemittanceInstance storage instance = remittances[instanceId];
        require(instance.owner == msg.sender);
        // After the deadline block, owner can claim funds
        require(instance.deadlineBlock <= block.number);
        LogProjectCancelled(instance.owner, instanceId);
        // Save the amount to be sent in a seperate variable
        uint amountToSend = instance.amount;
        // Clear the instance amount
        instance.amount = 0;
        // Finally, transfer the amount to the owner
        msg.sender.transfer(amountToSend);
    }

    function newProject(bytes32 passphrase, uint deadlineBlock)
    public
    pausable
    payable
    returns (uint instanceId)
    {
        // Deadline can't be further away than the max Deadline BlockHeight
        require((deadlineBlock - block.number) > maxDeadlineHeight);
        // There needs to be something to remit
        require(msg.value > 0);
        // Create new Project struct
        RemittanceInstance memory remittanceInstance =  RemittanceInstance(msg.sender, passphrase, msg.value, deadlineBlock);
        remittanceInstanceCount++;
        remittances[remittanceInstanceCount] = remittanceInstance;
        LogProjectCreated(msg.sender, msg.value, remittanceInstanceCount);
        return remittanceInstanceCount;
    }

    // Emergency function to drain all funds from the contract and pauses it
    function panicButton(address emergencyExit)
    public
    onlyOwner
    {
        if(emergencyExit != address(0))
        {
            LogKillswitch(emergencyExit, this.balance);
            emergencyExit.transfer(this.balance);
        }else{
            LogKillswitch(msg.sender, this.balance);
            msg.sender.transfer(this.balance);
        }
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