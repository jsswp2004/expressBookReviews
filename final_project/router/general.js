// const express = require('express');
// let books = require("./booksdb.js");
// let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;
// const public_users = express.Router();


// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
//  });

// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// //  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// module.exports.general = public_users;


const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
// public_users.get('/', (req, res) => {
//   res.status(200).json(books);
// });

// Using Promise Callbacks
public_users.get('/', (req, res) => {
  const getBooks = () => new Promise(resolve => setTimeout(() => resolve(books), 100));

  getBooks()
    .then(bookList => {
      res.status(200).json(bookList);
    })
    .catch(error => {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});


// Using Promise Callbacks
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  // Simulating an asynchronous operation using a Promise
  new Promise((resolve, reject) => {
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (book) {
      resolve(book);
    } else {
      reject('Book not found');
    }
  })
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  if (filteredBooks.length) {
    res.status(200).json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// using Promise Callbacks
const axios = require('axios');

public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
    // Example API endpoint - replace with the actual API URL
    // The API URL should be able to handle requests filtered by author
    const apiUrl = `https://localhost:5001/api/books?author=${encodeURIComponent(author)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.length) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    // Handle errors such as network issues, server unavailability, etc.
    res.status(500).json({ message: "Error fetching books by author" });
  }
});


// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length) {
    res.status(200).json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});
// using Promise Callbacks
// const axios = require('axios');

public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  // Example API endpoint - replace with the actual API URL
  const apiUrl = `https://example.com/api/books?title=${encodeURIComponent(title)}`;

  axios.get(apiUrl)
    .then(response => {
      if (response.data && response.data.length) {
        res.status(200).json(response.data);
      } else {
        res.status(404).json({ message: "No books found with this title" });
      }
    })
    .catch(error => {
      // Handle errors such as network issues, server unavailability, etc.
      res.status(500).json({ message: "Error fetching books by title" });
    });
});



// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    res.status(200).json(book.reviews || {});
  } else {
    res.status(404).json({ message: "Book not found" });
  }


});

// Modify a book review
public_users.put('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body; // Assuming review is the new review text
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    book.reviews = review;
    res.status(200).json({ message: "Review updated successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
public_users.delete('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    book.reviews = {}; // Assuming the reviews are an object, setting it to an empty object
    res.status(200).json({ message: "Review deleted successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/authors', function (req, res) {
  const allAuthors = [...new Set(Object.values(books).map(book => book.author))];
  res.status(200).json(allAuthors);
});


module.exports.general = public_users;
