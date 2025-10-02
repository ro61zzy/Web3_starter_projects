// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Contract {
    address public owner;

    address public charityAddress;

    constructor(address _charityAddress) {
        owner = msg.sender;
        charityAddress = _charityAddress;
    }

    receive() external payable{
        
    }

    // tip the owner    
    function tip() public payable {
        (bool s, ) = owner.call{value: msg.value }("");
        require(s);
    }

    // transfer all remaining funds i
    function donate() public payable {
        (bool s, ) = charityAddress.call{value: address(this).balance }("");
        require(s);
    }
}