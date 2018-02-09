pragma solidity 0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

// Alice creates a new Remittance Instance with 2 passwords, ETH and a deadlineBlock
// Carol can unlock the funds with Bob's address and her password
// Bob can claim his funds with his address and his password
// If something goes wrong, Alice can step in and manually set Bob as the benificiary
// Alice can withdraw her funds up until a certain point, with maxDeadlineHeight defining the maximum blockheight after the creation
// Upon withdrawal, a fee is taken based on current tx.gasprice * contractCreationGasCost
// The contract owner can withdraw the current bankroll with takeProfits()


contract Remittance is Ownable {
    
    event LogRemittanceClaimed(address claimer, uint instanceId, uint feePaid);
    event LogRemittanceCreated(address owner, uint amount, uint instanceId);
    event LogRemittanceUnlocked(address unlocker, uint instanceId);
    event LogRemittanceCancelled(address remittanceInstanceOwner, uint instanceId);
    event LogRemittanceUpdated(address remittanceInstanceOwner, address benificiary);
    event LogKillswitch(address receiver, uint amount);
    event LogPaused(address sender, bool paused);
    
    mapping (uint => RemittanceInstance) public remittances;
    mapping (bytes32 => bool) public usedPasswords;
    
    // Current estimate of contract creation cost
    uint contractCreationGasCost = 2000000;
    uint remittanceInstanceCount;
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
        bytes32 password_one; // Hashed password_one
        bytes32 password_two; // Hashed password_two
        uint amount; // Amount of eth
        uint deadlineBlock; //  BlockHeight after which amount is reclaimable
        address claimer; // Who can claim the funds
    }
    
    function Remittance() public {
        owner = msg.sender;
    }
    
    // Person A can unlock the funds and specify a benificiary with their password
    function unlockFunds(uint instanceId, string password, address claimer)
    pausable
    public
    {
        // Get the remittanceInstance from our mapping by name
        RemittanceInstance storage instance = remittances[instanceId];
        // Make sure there is a instance under that name AND that there is still money to be sent
        require(instance.amount != 0);
        // This can only be done once
        require(instance.claimer == address(0));
        // We need the first hashed password to match
        require(instance.password_one == keccak256(password));
        LogRemittanceUnlocked(msg.sender, instanceId);
        instance.claimer = claimer;
    }
    
    // Person B can then claim the funds with their password
    function claimFunds(uint instanceId, string password)
    pausable
    public
    {
        // Get the remittanceInstance from our mapping by name
        RemittanceInstance storage instance = remittances[instanceId];
        // Make sure there is a instance under that name AND that there is still money to be sent
        require(instance.amount != 0);
        // We need the second hashed password to match
        require(instance.password_two == keccak256(password));
        // The msg.sender has to be the claimer
        require(msg.sender == instance.claimer);
        // Calculate current fee based on gasprice
        uint fee = tx.gasprice * 1000000 * contractCreationGasCost;
        // Add fee to the bankroll
        bankroll += fee;
        LogRemittanceClaimed(msg.sender, instanceId, fee);
        // Save the amount to be sent in a seperate variable
        uint amountToSend = instance.amount;
        // Gotta pay taxes
        amountToSend = amountToSend - fee;
        // Clear the instance amount
        instance.amount = 0;
        // Finally, transfer the amount to the person claiming it
        msg.sender.transfer(amountToSend);
    }
    
    // Owner of a project can cancel the remittance up until a certain point
    function cancelProject(uint instanceId)
    public
    pausable
    {
        // Get the instance from our mapping by name
        RemittanceInstance storage instance = remittances[instanceId];
        require(instance.owner == msg.sender);
        // After the deadline block, owner can claim funds
        require(instance.deadlineBlock <= block.number);
        LogRemittanceCancelled(instance.owner, instanceId);
        // Save the amount to be sent in a seperate variable
        uint amountToSend = instance.amount;
        // Clear the instance amount
        instance.amount = 0;
        // Finally, transfer the amount to the owner
        msg.sender.transfer(amountToSend);
    }
    
    // In case something goes wrong, allow the owner of a project to set the benificiary manually
    function updateProject(uint instanceId, address benificiary)
    public
    {
        // Get the instance from our mapping by name
        RemittanceInstance storage instance = remittances[instanceId];
        require(instance.owner == msg.sender);
        instance.claimer = benificiary;
        LogRemittanceUpdated(msg.sender, benificiary);
    }
    
    // Create a new Remittance project
    function newProject(bytes32 password_one, bytes32 password_two, uint deadlineBlock)
    public
    pausable
    payable
    returns (uint instanceId)
    {
        // Deadline can't be further away than the max Deadline BlockHeight
        require((deadlineBlock - block.number) > maxDeadlineHeight);
        // There needs to be something to remit
        require(msg.value > 0);
        // Don't reuse passwords
        require(!usedPasswords[password_one]);
        require(!usedPasswords[password_two]);
        // Create new Project struct
        RemittanceInstance memory remittanceInstance =  RemittanceInstance(msg.sender, password_one, password_two, msg.value, deadlineBlock, address(0));
        usedPasswords[password_one] = true;
        usedPasswords[password_two] = true;
        remittanceInstanceCount++;
        remittances[remittanceInstanceCount] = remittanceInstance;
        LogRemittanceCreated(msg.sender, msg.value, remittanceInstanceCount);
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
    
    // Drain the bankroll
    function takeProfits()
    onlyOwner
    public
    {
        require(msg.sender == owner);
        uint toSend = bankroll;
        bankroll = 0;
        owner.transfer(toSend);
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
    
    // Helper functions
    
    function gasPrice()
    public
    view
    returns(uint gasprice)
    {
        return (tx.gasprice * 1000000);
    }
    
    function hashPassword(string password)
    public
    pure
    returns(bytes32 hash)
    {
        return keccak256(password);
    }
    
}