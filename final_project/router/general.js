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
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {resolve(books)}, 3000);
    });

    promise.then((success) => {
        return res.status(200).json(success);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    // Retireve the isbn from the request url and send the corresponding book
    const isbn = req.params.isbn;
    
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {resolve(books[isbn])}, 3000);
    });

    const book = await promise;

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({message: "book not found"});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author_ = req.params.author;
    const author = author_.replace("_", " ");

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            let booksByAuthor = {};
            for (isbn in books) {
                if (books[isbn].author === author) {
                    booksByAuthor[isbn] = books[isbn];
                }
            }
            resolve(booksByAuthor);
        }, 3000);
    });

    const booksByAuthor = await promise;

    if (booksByAuthor == {}) {
        return res.status(404).json({message: "Author not found"});
    } else {
        return res.status(200).json(booksByAuthor);
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title_ = req.params.title;
    const title = title_.replace("_", " ");

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            let booksByTitle = {};
            for (isbn in books) {
                if (books[isbn].title === title) {
                    booksByTitle[isbn] = books[isbn];
                }
            }
            resolve(booksByTitle);
        }, 3000);
    });

    const booksByTitle = await promise;

    if (booksByTitle == {}) {
        return res.status(404).json({message: "Title not found"});
    } else {
        return res.status(200).json(booksByTitle);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
