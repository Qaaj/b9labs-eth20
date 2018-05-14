pragma solidity ^0.4.11;

contract Youtube {

    struct Video {
        string URL;
        string extra;
        address sender;
    }

    uint numVideos;

    string public lastURL;
    address public owner;
    mapping (uint => Video) public videos;

    event LogVideoCreated(uint indexed videoId, address indexed by, string URL, string message);

    function Youtube()
    public {
        owner = msg.sender;
    }

    function numVids()
    public
    view
    returns (uint num){
        return numVideos;
    }

    function requestVideo(string URL, string extra)
    public
    payable
    returns (uint videoID) {
        videoID = numVideos++;

        // videoID is return variable
        Video storage v = videos[videoID];
        v.extra = extra;
        v.sender = msg.sender;
        v.URL = URL;
        lastURL = URL;

        emit LogVideoCreated(videoID, msg.sender, URL, extra);

        return videoID;
    }

}
