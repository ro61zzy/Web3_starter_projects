import React, { useState, useEffect, useRef } from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { ethers } from "ethers";
import BooksTrackerABI from "../../../smart-contracts/out/BooksTracker.sol/BooksTracker.json";

const contractAddress = "0xF10b83EE26F2e0f0B68c40d5380a775846c0598D";

export default function Home() {
  const [user, setUser] = useState("");
  const [personName, setPersonName] = useState("");
  const [personGenres, setPersonGenres] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPerson, setBookPerson] = useState("");
  const [booksRead, setBooksRead] = useState([]);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [booksTrackerContract, setBooksTrackerContract] = useState(null);
  const [persons, setPersons] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingCreatePerson, setLoadingCreatePerson] = useState(false);
  const [loadingCreateBook, setLoadingCreateBook] = useState(false);
  const [loadingGetBooks, setLoadingGetBooks] = useState(false);
  const listenersAddedRef = useRef(false);

  useEffect(() => {
    if (booksTrackerContract && !listenersAddedRef.current) {
      const personCreatedListener = (name, genres) => {
        setPersons((prevPersons) => [...new Set([...prevPersons, { name, genres }])]);
      };

      const bookCreatedListener = (title, author) => {
        setBooks((prevBooks) => [...new Set([...prevBooks, { title, author }])]);
      };

      booksTrackerContract.on("PersonCreated", personCreatedListener);
      booksTrackerContract.on("BookCreated", bookCreatedListener);

      listenersAddedRef.current = true;

      return () => {
        booksTrackerContract.off("PersonCreated", personCreatedListener);
        booksTrackerContract.off("BookCreated", bookCreatedListener);
      };
    }
  }, [booksTrackerContract]);

  async function connectWallet() {
    if (!connected) {
      if (!window.ethereum) {
        console.error("MetaMask is not installed.");
        return;
      }
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        await newProvider.send("eth_requestAccounts", []);
        const newSigner = await newProvider.getSigner();
        const newContract = new ethers.Contract(
          contractAddress,
          BooksTrackerABI.abi,
          newSigner
        );
        const _walletAddress = await newSigner.getAddress();

        setProvider(newProvider);
        setSigner(newSigner);
        setBooksTrackerContract(newContract);
        setConnected(true);
        setWalletAddress(_walletAddress);
      } catch (err) {
        console.error("Failed to connect wallet", err);
      }
    } else {
      setConnected(false);
      setWalletAddress("");
      setProvider(null);
      setSigner(null);
      setBooksTrackerContract(null);
      listenersAddedRef.current = false;
    }
  }

  const handleCreatePerson = async () => {
    if (!booksTrackerContract) return;
    setLoadingCreatePerson(true);
    try {
      const tx = await booksTrackerContract.createPerson(
        personName,
        parseInt(personGenres)
      );
      await tx.wait();
      console.log("Person created:", tx);
    } catch (err) {
      console.error("Failed to create person", err);
    } finally {
      setLoadingCreatePerson(false);
    }
  };

  const handleCreateBook = async () => {
    if (!booksTrackerContract) return;
    setLoadingCreateBook(true);
    try {
      const tx = await booksTrackerContract.createBook(
        bookTitle,
        bookAuthor,
        bookPerson
      );
      await tx.wait();
      console.log("Book created:", tx);
    } catch (err) {
      console.error("Failed to create book", err);
    } finally {
      setLoadingCreateBook(false);
    }
  };

  const handleGetBooksReadByPerson = async () => {
    if (!booksTrackerContract) return;
    setLoadingGetBooks(true);
    try {
      const books = await booksTrackerContract.getBooksReadByPerson(user);
      setBooksRead(books);
      console.log("Books read by person:", books);
    } catch (err) {
      console.error("Failed to get books read by person", err);
    } finally {
      setLoadingGetBooks(false);
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
            backgroundColor: connected ? "#4caf50" : "#0681bd",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "10px",
            "&:hover": {
              backgroundColor: connected ? "#45a049" : "#056b9a",
            },
          }}
        >
          {connected ? "Wallet Connected" : "Connect Wallet"}
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
            {persons.map((person, index) => (
              <Typography key={index}>{person.name}</Typography>
            ))}
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
              <TextField
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
              />
              <Typography>Genres</Typography>
              <TextField
                value={personGenres}
                onChange={(e) => setPersonGenres(e.target.value)}
              />
              <Button
                onClick={handleCreatePerson}
                disabled={loadingCreatePerson}
                sx={{
                  backgroundColor: "#0681bd",
                  p: "8px",
                  color: "#fff",
                  mt: "8px",
                }}
              >
                {loadingCreatePerson ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Add"
                )}
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
              <TextField
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
              />
              <Typography>Author</Typography>
              <TextField
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
              />
              <Typography>Person</Typography>
              <TextField
                value={bookPerson}
                onChange={(e) => setBookPerson(e.target.value)}
              />
              <Button
                onClick={handleCreateBook}
                disabled={loadingCreateBook}
                sx={{
                  backgroundColor: "#0681bd",
                  p: "8px",
                  color: "#fff",
                  mt: "8px",
                }}
              >
                {loadingCreateBook ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Add"
                )}
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
            {books.map((book, index) => (
              <Typography key={index}>{book.title}</Typography>
            ))}
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
          <Typography sx={{ fontSize: "20px" }}>Books Read:</Typography>
          <TextField
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter user name"
            InputProps={{
              style: { color: "#fff" },
            }}
          />
          <Button
            onClick={handleGetBooksReadByPerson}
            disabled={loadingGetBooks}
            sx={{
              backgroundColor: "#0681bd",
              p: "8px",
              color: "#fff",
              mt: "8px",
            }}
          >
            {/* {loadingGetBooks ? (
              <CircularProgress size={20} color="white" />
            ) : ( */}
              "Get Books"
            {/* )} */}
          </Button>
          {booksRead.map((book, index) => (
            <Typography key={index}>{book}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
