import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { ethers } from "ethers";
import BooksTrackerABI from "../../../smart-contracts/out/BooksTracker.sol/BooksTracker.json";

const contractAddress = "0xa2f9935497B1928c6C47006e6dcE0C321F5F8ad9";

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
  const [loadingCreatePerson, setLoadingCreatePerson] = useState(false);
  const [loadingCreateBook, setLoadingCreateBook] = useState(false);
  const [loadingGetBooks, setLoadingGetBooks] = useState(false);
  const [persons, setPersons] = useState([]);
  const [books, setBooks] = useState([]);


  // Function to connect/disconnect the wallet
  async function connectWallet() {
    if (!connected) {
      if (!window.ethereum) {
        console.error("MetaMask is not installed.");
        return;
      }
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newSigner = await newProvider.getSigner();
        const _walletAddress = await newSigner.getAddress();

        const newContract = new ethers.Contract(
          contractAddress,
          BooksTrackerABI.abi,
          newSigner
        );
  
        setProvider(newProvider);
        setSigner(newSigner);
        setConnected(true);
        setBooksTrackerContract(newContract);
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
    }
  }

 // Function to create a person
// Function to create a person
const handleCreatePerson = async () => {
  if (!booksTrackerContract) return;
  setLoadingCreatePerson(true); // Show loader
  try {
    const tx = await booksTrackerContract.connect(signer).createPerson(personName, parseInt(personGenres));
    await tx.wait();
    console.log("Person created:", tx);
    // Fetch the updated list of persons after adding a person
    const updatedPersons = await fetchPersons();
    setPersons(updatedPersons);
  } catch (err) {
    console.error("Failed to create person", err);
  } finally {
    setLoadingCreatePerson(false); // Hide loader
  }
};


  // Function to create a book
  const handleCreateBook = async () => {
    if (!booksTrackerContract) return;
    setLoadingCreateBook(true); // Show loader
    try {
      const tx = await booksTrackerContract.connect(signer).createBook(bookTitle, bookAuthor, bookPerson);
      await tx.wait();
      console.log("Book created:", tx);
    } catch (err) {
      console.error("Failed to create book", err);
    } finally {
      setLoadingCreateBook(false); // Hide loader
    }
  };

  // Function to get books read by a person
  const handleGetBooksReadByPerson = async () => {
    if (!booksTrackerContract) return;
    setLoadingGetBooks(true); // Show loader
    try {
      const books = await booksTrackerContract.getBooksReadByPerson(user);
      setBooksRead(books);
      console.log("Books read by person:", books);
    } catch (err) {
      console.error("Failed to get books read by person", err);
    } finally {
      setLoadingGetBooks(false); // Hide loader
    }
  };

  async function fetchPersons() {
    try {
      // Get the contract instance
      const contract = new ethers.Contract(contractAddress, BooksTrackerABI, provider);
  
      // Call the getListOfPeople function
      const persons = await contract.getListOfPeople();
  
      return persons;
    } catch (err) {
      console.error("Failed to fetch persons", err);
      return [];
    }
  }

  async function fetchBooks() {
    try {
      // Get the contract instance
      const contract = new ethers.Contract(contractAddress, BooksTrackerABI, provider);
  
      // Call the getListOfBooks function
      const books = await contract.getListOfBooks();
  
      return books;
    } catch (err) {
      console.error("Failed to fetch books", err);
      return [];
    }
  }
  
  useEffect(() => {
    async function fetchData() {
      // Fetch persons
      // Example:
      const personsData = await fetchPersons();
      setPersons(personsData);

      // Fetch books
      // Example:
      const booksData = await fetchBooks();
      setBooks(booksData);
    }

    fetchData();
  }, []);
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
               {loadingCreatePerson ? <CircularProgress size={20} color="inherit" /> : "Add"}
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
               {loadingCreateBook? <CircularProgress size={20} color="inherit" /> : "Add"}
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
            color: "#fff", // Apply color to the entire box
          }}
        >
          <Typography sx={{ fontSize: "20px" }}>Books Read:</Typography>
          <TextField
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter user name"
            InputProps={{
              // Apply color to the input text
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
            {loadingGetBooks ? <CircularProgress size={20} color="white" /> : "Get Books"}
          </Button>
          {booksRead.map((book, index) => (
            <Typography key={index}>{book}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
