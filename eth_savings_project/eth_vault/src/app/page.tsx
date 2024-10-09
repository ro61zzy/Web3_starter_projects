"use client";

import { useState } from "react";
import { ethers } from "ethers";
import "./Home.css";

export default function Home() {
  const [contractAddress] = useState<string>(
    "0x99cb017E19782Dd31772fd0B713e8ED722a83fb2"
  ); 
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);


  const abi = require("../../../smart_contracts/artifacts/contracts/EthVault.sol/EthVault.json").abi;

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(account);
        setWalletConnected(true);
        setMessage("Wallet connected successfully!");
      } catch (error) {
        console.error("Wallet connection error:", error);
        setMessage("Failed to connect wallet.");
      }
    } else {
      alert("MetaMask is not installed!");
    }
  }

  
  async function fetchUserBalance() {
    if (typeof window.ethereum !== "undefined") {
      setIsProcessing(true); 
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance: ethers.BigNumber = await contract.getBalance();
        setUserBalance(ethers.formatEther(balance)); 
        setMessage("Balance fetched successfully!");
      } catch (err) {
        console.error("Error fetching balance:", err);
        setMessage("Failed to fetch balance.");
      } finally {
        setIsProcessing(false);
      }
    }
  }

  async function depositEth() {
    if (!inputAmount) return alert("Please enter a valid amount of ETH");

    if (typeof window.ethereum !== "undefined") {
      setIsProcessing(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.deposit({
          value: ethers.parseEther(inputAmount),
        });
        await tx.wait();
        setInputAmount("");
        fetchUserBalance(); 
        setMessage("Deposit successful!");
      } catch (err) {
        console.error("Error during deposit:", err);
        setMessage("Deposit failed. Please try again.");
      } finally {
        setIsProcessing(false); 
      }
    }
  }


  async function withdrawEth() {
    if (!inputAmount) return alert("Please enter a valid amount to withdraw");

    if (typeof window.ethereum !== "undefined") {
      setIsProcessing(true); 
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.withdraw(ethers.parseEther(inputAmount));
        await tx.wait();
        setInputAmount("");
        fetchUserBalance(); 
        setMessage("Withdrawal successful!");
      } catch (err) {
        console.error("Error during withdrawal:", err);
        setMessage("Withdrawal failed. Please try again.");
      } finally {
        setIsProcessing(false); 
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

        {/* Status Message */}
        {message && <p className="message">{message}</p>}

        {walletConnected && (
          <div className="actions">
            <button
              className="btn"
              onClick={fetchUserBalance}
              disabled={isProcessing}
            >
              {isProcessing ? "Fetching Balance..." : "Get My Balance"}
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
              <button
                className="btn"
                onClick={depositEth}
                disabled={isProcessing}
              >
                {isProcessing ? "Depositing..." : "Deposit ETH"}
              </button>
              <button
                className="btn withdraw-btn"
                onClick={withdrawEth}
                disabled={isProcessing}
              >
                {isProcessing ? "Withdrawing..." : "Withdraw ETH"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
