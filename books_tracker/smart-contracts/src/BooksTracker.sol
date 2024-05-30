// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BooksTracker {
//events call to make sure data is always up to date -  a way to log and notify external entities (such as user interfaces or other smart contracts) about specific occurrences within a smart contract
 event PersonCreated(string name, uint genres);
    event BookCreated(string title, string author);

    // Define a struct for a person
    struct Person {
        string name; // Name of the person
        uint genres; // Number of genres the person likes (just an example)
    }

    // Define a struct for a book
    struct Book {
        string title; // Title of the book
        string author; // Author of the book
    }

    // Array to store instances of Person
    Person[] public listOfPeople;

    // Array to store instances of Book
    Book[] public listOfBooks;

    // Mapping to associate each person with the titles of the books they've read
    mapping(string => string[]) public booksRead;

    // Function to create a person
    function createPerson(string memory _name, uint _genres) public {
        // Push a new instance of Person to the listOfPeople array
        listOfPeople.push(Person(_name, _genres));
        //emit event here to show a new thing has happenned 
        emit PersonCreated(_name, _genres);
    }

      // Function to get the list of people
    function getListOfPeople() public view returns (Person[] memory) {
        return listOfPeople;
    }

    // Function to create a book
    function createBook(string memory _title, string memory _author, string memory _person) public {
        // Push a new instance of Book to the listOfBooks array
        listOfBooks.push(Book(_title, _author));
        // Associate the title of the book with the person who read it
        booksRead[_person].push(_title);
        //emit event for new book
        emit BookCreated(_title, _author);
    }

      // Function to get the list of books
    function getListOfBooks() public view returns (Book[] memory) {
        return listOfBooks;
    }

    // Function to get the titles of the books read by a specific person
    function getBooksReadByPerson(string memory _person) public view returns (string[] memory) {
        // Retrieve the array of book titles associated with the person from the mapping
        return booksRead[_person];
    }
}

//deploy to sepolia testnet
//contract address is 0xF10b83EE26F2e0f0B68c40d5380a775846c0598D
//the ABI is in out folder as a json file
//forge create --rpc-url https://eth-sepolia.g.alchemy.com/v2/wGg9QP9ItadT7QRQYBJ1FQCn1J8o-Ics --private-key 513caa5c7a2b593053d37bbadd3d1ec6bd72b5c32117320b73d5becffe87b03d src/BooksTracker.sol:BooksTracker 
