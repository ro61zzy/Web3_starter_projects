pragma solidity ^0.8.19;

contract BooksTracker {
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
    }

    // Function to create a book
    function createBook(string memory _title, string memory _author, string memory _person) public {
        // Push a new instance of Book to the listOfBooks array
        listOfBooks.push(Book(_title, _author));
        // Associate the title of the book with the person who read it
        booksRead[_person].push(_title);
    }

    // Function to get the titles of the books read by a specific person
    function getBooksReadByPerson(string memory _person) public view returns (string[] memory) {
        // Retrieve the array of book titles associated with the person from the mapping
        return booksRead[_person];
    }
}
