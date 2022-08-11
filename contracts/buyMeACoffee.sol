// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

//deployed @ 0x3C948A59C78824298B954b4d4A6E6C3A068Dde8C

// Import this file to use console.log
import "hardhat/console.sol";

contract buyMeACoffee {
    // Event to emit when a memo is created
    event newMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // list of all memos received
    Memo[] memos;

    // adress of the deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function changeOwner(address payable newOwner) public {
        require(payable(msg.sender) == owner, "naaaope");
        owner = newOwner;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't buy coffee with 0 eth");

        // add memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        //emit a log event when memo is created
        emit newMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}
