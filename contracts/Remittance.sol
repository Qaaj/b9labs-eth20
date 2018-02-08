pragma solidity 0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Remittance is Ownable {

    mapping (string => Project) projects;

    struct Project {
        bytes32 password_one; // Hashed password_one
        bytes32 password_two; // Hashed password_two
        uint amount; // Amount of eth
    }

    function Remittance() public {
        owner = msg.sender;
    }

    function claimMoney(string name, string password_one, string password_two)
    public
    {
        var project = projects[name]; // Get the project form our mapping by name
        require(project.amount != 0); // Make sure there is a project under that name
        require(project.password_one == keccak256(password_one)); // We need the hashed password_one to match
        require(project.password_two == keccak256(password_two)); // We need the hashed password_two to match
        msg.sender.transfer(project.amount); // Transfer the amount to the person claiming it
    }

    function newProject(string name, bytes32 password_one, bytes32 password_two)
    public
    payable
    returns (bool succes)
    {
        require(msg.value != 0); // need some eth to be sent for new Remittance project
        require(password_one != 0x0); // no empty password_one
        require(password_two != 0x0); // no empty password_two
        var exisitingProject = projects[name]; // See if a project already exists with this name
        require(exisitingProject.amount != 0); // This prevents people from overwriting an exisiting project
        var project = Project(password_one, password_two, msg.value); // Create new project struct
        projects[name] = project; // Save the project
        return true;
    }

    function doHashing(string extra)
    public
    pure
    returns (bytes32 hash)
    {
        return keccak256(extra);
    }

}