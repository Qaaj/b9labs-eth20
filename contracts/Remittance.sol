pragma solidity 0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Remittance is Ownable {

    event LogProjectClaimed(address claimer, uint projectId);
    event LogProjectCreated(address owner, uint amount, uint projectId);
    event LogProjectCancelled(address projectOwner, uint projectId);
    event LogKillswitch(address receiver, uint amount);
    event LogPaused(address sender, bool paused);

    mapping (uint => Project) public projects;

    uint projectCount;
    bool paused;

    modifier pausable{
        require(!paused);
        _;
    }

    struct Project {
        address owner;
        bytes32 passphrase; // Hashed password_one
        uint amount; // Amount of eth
        uint deadlineBlock; //  BlockHeight after which amount is reclaimable
    }

    function Remittance() public {
        owner = msg.sender;
    }

    function claimMoney(uint projectId, string password_one, string password_two)
    pausable
    public
    {
        // Get the project from our mapping by name
        Project storage project = projects[projectId];
        // Make sure there is a project under that name AND that there is still money to be sent
        require(project.amount != 0);
        // We need the hashed passwords to match
        require(project.passphrase == keccak256(keccak256(password_one),keccak256(password_two)));
        LogProjectClaimed(msg.sender, projectId);
        // Save the amount to be sent in a seperate variable
        uint amountToSend = project.amount;
        // Clear the project amount
        project.amount = 0;
        // Finally, transfer the amount to the person claiming it
        msg.sender.transfer(amountToSend);
    }

    function cancelProject(uint projectId)
    public
    pausable
    {
        // Get the project from our mapping by name
        Project storage project = projects[projectId];
        require(project.owner == msg.sender);
        // After the deadline block, owner can claim funds
        require(project.deadlineBlock <= block.number);
        LogProjectCancelled(project.owner, projectId);
        // Save the amount to be sent in a seperate variable
        uint amountToSend = project.amount;
        // Clear the project amount
        project.amount = 0;
        // Finally, transfer the amount to the owner
        msg.sender.transfer(amountToSend);
    }

    function newProject(bytes32 passphrase, uint deadlineBlock)
    public
    pausable
    payable
    returns (uint projectId)
    {
        // Create new Project struct
        Project memory project =  Project(msg.sender, passphrase, msg.value, deadlineBlock);
        projectCount++;
        projects[projectCount] = project;
        LogProjectCreated(msg.sender, msg.value, projectCount);
        return projectCount;
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