"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [contractAddress] = useState<string>('0x99cb017E19782Dd31772fd0B713e8ED722a83fb2'); // Replace with your deployed contract address
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [contractBalance, setContractBalance] = useState<string>('');

  // ABI of the EthVault contract
  const abi = [
    "function deposit() payable external",
    "function withdraw(uint256 amount) external",
    "function getBalance() external view returns (uint256)"
  ];

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // Prompt user to connect to their wallet if needed
      window.ethereum.request({ method: 'eth_requestAccounts' });
    }
  }, []);

  // Function to fetch the user's balance in the contract
  async function fetchUserBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const balance: ethers.BigNumber = await contract.getBalance();
      setUserBalance(ethers.formatEther(balance));
    }
  }

  // Function to deposit ETH into the contract
  async function depositEth() {
    if (!inputAmount) return alert('Please enter a valid amount of ETH');

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.deposit({ value: ethers.parseEther(inputAmount) });
        await tx.wait();
        setInputAmount('');
        fetchUserBalance(); // Update balance after deposit
      } catch (err) {
        console.error('Error:', err);
      }
    }
  }

  // Function to withdraw ETH from the contract
  async function withdrawEth() {
    if (!inputAmount) return alert('Please enter a valid amount to withdraw');

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.withdraw(ethers.parseEther(inputAmount));
        await tx.wait();
        setInputAmount('');
        fetchUserBalance(); // Update balance after withdrawal
      } catch (err) {
        console.error('Error:', err);
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>ETH Vault</h1>
      <div>
        <button onClick={fetchUserBalance}>Get My Balance</button>
        {userBalance !== null && <p>My Contract Balance: {userBalance} ETH</p>}
      </div>
      <div>
        <input
          type="number"
          placeholder="Amount in ETH"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
        />
        <button onClick={depositEth}>Deposit ETH</button>
        <button onClick={withdrawEth}>Withdraw ETH</button>
      </div>
    </div>
  );
}
