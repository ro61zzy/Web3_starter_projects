// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EthVault {
    // Mapping to track the balance of each address
    mapping(address => uint256) public balances;

    // Event for deposits
    event Deposit(address indexed user, uint256 amount);
    
    // Event for withdrawals
    event Withdraw(address indexed user, uint256 amount);

    // Function to deposit ETH into the contract
    function deposit() external payable {
        require(msg.value > 0, "Must send some ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Function to withdraw ETH from the contract
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

        // Transfer ETH back to the user
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdraw(msg.sender, amount);
    }

    // Function to check the balance of the user
    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
