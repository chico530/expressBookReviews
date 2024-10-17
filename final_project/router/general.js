const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the username and password are provided
    if (username && password) {
        // Check if the user doesn't already exist
        if (isValid(username)) {
            // Add user to the users array
            users.push({
                "username": username,
                "password": password
            });
            return res.status(200).json({message: "User succesfully registered, you can now login"});
        } else {
            return res.status(404).json({message: "this user name already exists"});
        }
    }
    return res.status(404).json({message: "Enable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retireve the isbn from the request url and send the corresponding book
    const isbn = req.params.isbn;
    return res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Retrieve the author name from the url
    const author = req.params.author;
    // Convert the author name to be compared to the books
    const author_names = author.split("-");
    let booksByAuthor = [];
    // Check for all books if the author name matches
    for (isbn in books) {
        const names = books[isbn].author.toLowerCase();
        const those_names = names.split(" ");
        // Add the element to the list if there is a match
        if (JSON.stringify(those_names) === JSON.stringify(author_names)) {
            booksByAuthor.push({
                "isbn": isbn,
                "author": books[isbn].author,
                "title": books[isbn].title,
                "reviews": books[isbn].reviews,
            });
        }
    }
    return res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the book title in the url
    const title = req.params.title;
    // Convert the book title url so it can be compared
    const title_words = title.split("-");
    let booksByTitle = [];
    // Iterate through the books and compare the title
    for (isbn in books) {
        const phrase = books[isbn].title.toLowerCase();
        const words = phrase.split(" ");
        if (JSON.stringify(words) === JSON.stringify(title_words)) {
            booksByTitle.push({
                "isbn": isbn,
                "author": books[isbn].author,
                "title": books[isbn].title,
                "reviews": books[isbn].reviews,
            });
        }
    }
    return res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
