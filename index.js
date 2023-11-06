const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const connectionString = 'mongodb://127.0.0.1:27017/bookapp';


app.use(express.json());

mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  
.then(() => console.log('Database connection successful'))
.catch(err => console.error('Database connection error:', err));

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  summary: String,
});

const Book = mongoose.model('Book', bookSchema);

// CREATE a new book
app.post('/books', async (req, res) => {
    const books = req.body; // Assuming req.body is an array of books
  
    try {
      const newBooks = [];
      for (const bookData of books) {
        const book = new Book(bookData);
        const savedBook = await book.save();
        newBooks.push(savedBook);
      }
      res.status(201).json(newBooks);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// READ all books
app.get('/books', (req, res) => {
  Book.find()
    .then(books => res.json(books))
    .catch(err => res.status(500).json(err));
});

// READ a single book by ID
app.get('/books/:id', (req, res) => {
  Book.findById(req.params.id)
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    })
    .catch(err => res.status(500).json(err));
});

// UPDATE a book by ID
app.put('/books/:id', (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updatedBook => {
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(updatedBook);
    })
    .catch(err => res.status(500).json(err));
});

// DELETE a book by ID
app.delete('/books/:id', (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(deletedBook => {
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully' });
    })
    .catch(err => res.status(500).json(err));
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
