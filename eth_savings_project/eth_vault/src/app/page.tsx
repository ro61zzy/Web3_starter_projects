"use client";

import { useState } from "react";
import { ethers } from "ethers";
import "./Home.css"; // Include the CSS file

export default function Home() {
  const [contractAddress] = useState<string>(
    "0x99cb017E19782Dd31772fd0B713e8ED722a83fb2"
  ); // Replace with your deployed contract address
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // ABI of the EthVault contract
  const abi = require("../../../smart_contracts/artifacts/contracts/EthVault.sol/EthVault.json").abi;

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(account);
        setWalletConnected(true);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  }

  // Function to fetch the user's balance in the contract
  async function fetchUserBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const balance: ethers.BigNumber = await contract.getBalance();
      setUserBalance(ethers.formatEther(balance));
    }
  }

  // Function to deposit ETH into the contract
  async function depositEth() {
    if (!inputAmount) return alert("Please enter a valid amount of ETH");

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.deposit({
          value: ethers.parseEther(inputAmount),
        });
        await tx.wait();
        setInputAmount("");
        fetchUserBalance(); // Update balance after deposit
      } catch (err) {
        console.error("Error:", err);
      }
    }
  }

  // Function to withdraw ETH from the contract
  async function withdrawEth() {
    if (!inputAmount) return alert("Please enter a valid amount to withdraw");

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.withdraw(ethers.parseEther(inputAmount));
        await tx.wait();
        setInputAmount("");
        fetchUserBalance(); // Update balance after withdrawal
      } catch (err) {
        console.error("Error:", err);
      }
    }
  }

  return (
    <div className="container">
      <h1 className="title">ETH Vault</h1>
      <p className="description">
        A decentralized application that allows users to deposit and withdraw
        ETH securely from a smart contract. Connect your MetaMask wallet, view
        your contract balance, and manage your funds.
      </p>

      <div className="card">
        {!walletConnected ? (
          <button className="btn connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <p className="wallet-info">Connected: {walletAddress}</p>
        )}

        {walletConnected && (
          <div className="actions">
            <button className="btn" onClick={fetchUserBalance}>
              Get My Balance
            </button>
            {userBalance !== null && (
              <p className="balance">My Contract Balance: {userBalance} ETH</p>
            )}
            <input
              type="number"
              placeholder="Amount in ETH"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="input"
            />
            <div className="btn-group">
              <button className="btn" onClick={depositEth}>
                Deposit ETH
              </button>
              <button className="btn withdraw-btn" onClick={withdrawEth}>
                Withdraw ETH
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
