"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, TextField, Box, Typography, Divider } from "@mui/material"; 

const KvassStaking = () => {
  const [message, setMessage] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
  
        setMessage("Wallet connected successfully!");
      } catch (error) {
        console.error("Wallet connection error:", error);
        setMessage("Failed to connect wallet.");
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const depositIntoVault = async () => {
    console.log("this fn logic");
  };

  const stakeInFermenter = async () => {
    console.log("also this fn logic");
  };

  const fetchKvassRewards = async () => {
    console.log("another fn logic");
  };



  return (
    <Box className="kvass-container">
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      {message && <p className="message">{message}</p>}
        <Button
          sx={{
            backgroundColor: "brown",
            color: "#fff",
            p: "8px",
            width: "250px",
          }}
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontSize: "44px",
            fontWeight: "800",
            pt: "10px",
            color: "brown",
          }}
        >
          Kvass Staking - By R
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "35px",
            p: "2rem",
            color: "#712e05",
            fontWeight: "500",
          }}
        >
          On Morpho, deposit your tokens into Vault, get token vault, stake -
          Fermenter- earn kvass
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          <Typography sx={{ fontSize: "30px", color: "brown" }}>
            Vault Token Balance: 0
          </Typography>
          <Button
            sx={{
              backgroundColor: "brown",
              color: "#fff",
              p: "8px",
              width: "250px",
            }}
            onClick={depositIntoVault}
          >
            Deposit Into Vault
          </Button>
        </Box>
        <Divider sx={{ color: "#000", p: "4px", width: "100%", mt: "3rem" }} />
        <TextField
          label="Enter amount to stake"
          variant="outlined"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          sx={{ width: "50%", mt: "1rem", p: "1rem", fontSize: "20px" }}
          margin="normal"
        />
        <Divider sx={{ color: "#000", p: "4px", width: "100%", mt: "1rem" }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
             mt: "3rem"
          }}
        >
          <Button
            sx={{
              backgroundColor: "brown",
              color: "#fff",
              p: "8px",
              width: "250px",
            }}
            onClick={stakeInFermenter}
          >
            Stake Vault Tokens
          </Button>
          <Button
            sx={{
              backgroundColor: "#a68069",
              color: "#000",
              p: "8px",
              width: "250px",
            }}
            onClick={fetchKvassRewards}
          >
            Fetch Kvass Rewards
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default KvassStaking;
