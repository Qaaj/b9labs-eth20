pragma solidity ^0.4.11;

contract Splitter {

    address public owner;

    function Splitter() public {
        owner = msg.sender;
    }

}