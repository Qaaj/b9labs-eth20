pragma solidity 0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Remittance is Ownable {

    mapping (uint => Project) public projects;
    uint projectCount;

    struct Project {
        bytes32 password_one; // Hashed password_one
        bytes32 password_two; // Hashed password_two
        uint amount; // Amount of eth
    }

    function Remittance() public {
        owner = msg.sender;
    }

    function claimMoney(uint projectId, string password_one, string password_two)
    public
    {
        // Get the project from our mapping by name
        Project storage project = projects[projectId];
        // Make sure there is a project under that name AND that there is still money to be sent
        require(project.amount != 0);
        // We need the hashed passwords to match
        require(project.password_one == keccak256(password_one));
        require(project.password_two == keccak256(password_two));
        // Save the amount to be sent in a seperate variable
        uint amountToSend = project.amount;
        // Clear the amount of money to send before sending it to avoid re-entry
        project.amount = 0;
        // Finally, transfer the amount to the person claiming it
        msg.sender.transfer(amountToSend);
    }

    function newProject(bytes32 password_one, bytes32 password_two)
    public
    payable
    returns (uint projectId)
    {
        // Create new Project struct
        Project memory project =  Project(password_one, password_two, msg.value);
        projectCount++;
        projects[projectCount] = project;
        return projectCount;
    }

    // Emergency function to drain all funds from the contract
    function panicButton(address emergencyExit)
    public
    onlyOwner
    {
        emergencyExit.transfer(this.balance);
    }
}