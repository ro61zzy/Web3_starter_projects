import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ethers } from "ethers";
import BooksTrackerABI from '../../../smart-contracts/out/BooksTracker.sol/BooksTracker.json';

const contractAddress = "0xAF2C06b422474A451C97F8953602b731693C232f";

export default function Home() {
  const [user, setUser] = useState("");
  const [personName, setPersonName] = useState("");
  const [personGenres, setPersonGenres] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPerson, setBookPerson] = useState("");
  const [booksRead, setBooksRead] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [booksTrackerContract, setBooksTrackerContract] = useState(null);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error("No web3 provider found. Please install MetaMask.");
      return;
    }
    
    try {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      await newProvider.send("eth_requestAccounts", []);
      const newSigner = newProvider.getSigner();
      const newContract = new ethers.Contract(contractAddress, BooksTrackerABI.abi, newSigner);
      setProvider(newProvider);
      setSigner(newSigner);
      setBooksTrackerContract(newContract);
      setWalletConnected(true);
    } catch (err) {
      console.error("Failed to connect wallet", err);
    }
  };
  

  const handleCreatePerson = async () => {
    if (!booksTrackerContract) return;
    try {
      const tx = await booksTrackerContract.createPerson(personName, parseInt(personGenres));
      await tx.wait();
      console.log('Person created:', tx);
    } catch (err) {
      console.error("Failed to create person", err);
    }
  };

  const handleCreateBook = async () => {
    if (!booksTrackerContract) return;
    try {
      const tx = await booksTrackerContract.createBook(bookTitle, bookAuthor, bookPerson);
      await tx.wait();
      console.log('Book created:', tx);
    } catch (err) {
      console.error("Failed to create book", err);
    }
  };

  const handleGetBooksReadByPerson = async () => {
    if (!booksTrackerContract) return;
    try {
      const books = await booksTrackerContract.getBooksReadByPerson(user);
      setBooksRead(books);
      console.log('Books read by person:', books);
    } catch (err) {
      console.error("Failed to get books read by person", err);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          p: "1rem",
        }}
      >
        <Button
          onClick={connectWallet}
          sx={{
            p: "10px",
            backgroundColor: walletConnected ? "#4caf50" : "#0681bd",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "10px",
          }}
        >
          {walletConnected ? "Wallet Connected" : "Connect Wallet"}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            width: "20%",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              color: "#0681bd",
              fontSize: "28px",
              pb: "10px",
            }}
          >
            Users
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography>user 1</Typography>
            <Typography>user 2</Typography>
            <Typography>user 3</Typography>
            <Typography>user 4</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "38%",
          }}
        >
          <Typography
            sx={{ textAlign: "center", fontSize: "28px", pb: "10px" }}
          >
            Book Tracker
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#204d63",
              p: "3rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#a0b3bd",
                p: "1rem",
                borderRadius: "5px",
              }}
            >
              <Typography sx={{ textAlign: "center", color: "#0681bd" }}>
                Readers
              </Typography>
              <Typography>Name</Typography>
              <TextField value={personName} onChange={(e) => setPersonName(e.target.value)} />
              <Typography>Genres</Typography>
              <TextField value={personGenres} onChange={(e) => setPersonGenres(e.target.value)} />
              <Button
                onClick={handleCreatePerson}
                sx={{
                  backgroundColor: "#0681bd",
                  p: "8px",
                  color: "#fff",
                  mt: "8px",
                }}
              >
                Add
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#a0b3bd",
                p: "1rem",
                borderRadius: "5px",
              }}
            >
              <Typography sx={{ textAlign: "center", color: "#0681bd" }}>
                Books
              </Typography>
              <Typography>Title</Typography>
              <TextField value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
              <Typography>Author</Typography>
              <TextField value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)} />
              <Typography>Person</Typography>
              <TextField value={bookPerson} onChange={(e) => setBookPerson(e.target.value)} />
              <Button
                onClick={handleCreateBook}
                sx={{
                  backgroundColor: "#0681bd",
                  p: "8px",
                  color: "#fff",
                  mt: "8px",
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20%",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              color: "#0681bd",
              fontSize: "28px",
              pb: "10px",
            }}
          >
            Books
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography>book 1</Typography>
            <Typography>book 2</Typography>
            <Typography>book 3</Typography>
            <Typography>book 4</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "60%",
            height: "300px",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: "28px" }}>Susan Sunan</Typography>
          <Typography sx={{ fontSize: "20px" }}>Books Read:</Typography>
          <TextField value={user} onChange={(e) => setUser(e.target.value)} placeholder="Enter user name" />
          <Button onClick={handleGetBooksReadByPerson} sx={{ backgroundColor: "#0681bd", p: "8px", color: "#fff", mt: "8px" }}>Get Books</Button>
          {booksRead.map((book, index) => (
            <Typography key={index}>{book}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
