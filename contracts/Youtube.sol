pragma solidity ^0.4.11;

import "./Ownable.sol";

contract Youtube is Ownable {

    struct Video {
        string URL;
        string extra;
        address sender;
    }

    uint public numVideos;

    string public lastURL;
    address public owner;
    mapping (uint => Video) public videos;

    event LogVideoCreated(uint indexed videoId, address indexed by, string URL, string message);
    event LogBalanceUpdated(address indexed by, uint amount);
    event LogWithdrawal(address indexed by, uint amount);
    event LogKill(address indexed by);

    // Constructor
    function Youtube()
    public {
        owner = msg.sender;
    }

    // Fallback function
    function()
    public{
        revert();
    }

    function numVids()
    public
    view
    returns (uint num){
        return numVideos;
    }

    function getBalance()
    public
    view
    returns (uint bal) {
        return address(this).balance;
    }

    function requestVideo(string URL, string extra)
    public
    payable
    returns (uint videoID) {
        // Check if Contract hasn't been killed
        require(owner != 0);

        // Checks if a URL length > 4 has been added
        bytes memory URLString = bytes(URL);
        require(URLString.length > 3);

        videoID = numVideos++;

        // Checks if a message has been added
        bytes memory tempEmptyStringTest = bytes(extra);
        if(tempEmptyStringTest.length > 0){
            // Require a payment for a custom message
            require(msg.value > 0);

            emit LogBalanceUpdated(msg.sender, getBalance());
        }

        // videoID is return variable
        Video storage v = videos[videoID];
        v.extra = extra;
        v.sender = msg.sender;
        v.URL = URL;
        lastURL = URL;

        emit LogVideoCreated(videoID, msg.sender, URL, extra);

        return videoID;
    }

    // The Owner can use this function to withdraw their payments
    function withdrawFunds()
    public
    only_owner
    returns (bool success){
        uint amount = getBalance();
        require(amount > 0);

        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        emit LogWithdrawal(msg.sender, amount);

        msg.sender.transfer(amount);

        return true;
    }

    function kill()
    public
    only_owner {
        if(getBalance() > 0){
            withdrawFunds();
        }

        emit LogKill(msg.sender);

        selfdestruct(owner);
    }
}
