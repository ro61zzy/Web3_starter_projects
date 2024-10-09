"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [contractAddress] = useState<string>('0x99cb017E19782Dd31772fd0B713e8ED722a83fb2'); // Replace with your deployed contract address
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [contractBalance, setContractBalance] = useState<string>('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);


  // ABI of the EthVault contract
  const abi = require('../../../smart_contracts/artifacts/contracts/EthVault.sol/EthVault.json').abi;

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(account);
        setWalletConnected(true);
      } catch (error) {
        console.error('Wallet connection error:', error);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  }

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
      <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
            Connect Wallet
          </button>
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
