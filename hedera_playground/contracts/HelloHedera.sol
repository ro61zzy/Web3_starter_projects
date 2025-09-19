// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloHedera {
    string public greeting;

    // Set an initial greeting at deployment
    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    // Update the greeting
    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }

    // Read the current greeting
    function getGreeting() public view returns (string memory) {
        return greeting;
    }
}
