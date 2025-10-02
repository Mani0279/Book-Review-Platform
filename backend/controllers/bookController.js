import Book from '../models/Book.js';

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
  try {
    const { title, author, description, genre, publishedYear } = req.body;

    // Validation
    if (!title || !author || !description || !genre || !publishedYear) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create book
    const book = await Book.create({
      title,
      author,
      description,
      genre,
      publishedYear,
      addedBy: req.user._id,
    });

    // Populate user information
    await book.populate('addedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book,
    });
  } catch (error) {
    console.error('Add book error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding book',
      error: error.message,
    });
  }
};

// @desc    Get all books with pagination
// @route   GET /api/books?page=1&limit=5&search=&genre=&sortBy=
// @access  Public
const getAllBooks = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Search and filter parameters
    const search = req.query.search || '';
    const genre = req.query.genre || '';
    const sortBy = req.query.sortBy || '-createdAt'; // Default: newest first

    // Build query
    let query = {};

    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by genre
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);

    // Get books with pagination and sorting
    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .sort(sortBy)
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: books.length,
      totalBooks,
      totalPages,
      currentPage: page,
      data: books,
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books',
      error: error.message,
    });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      'addedBy',
      'name email'
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Get book error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching book',
      error: error.message,
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Only book creator)
const updateBook = async (req, res) => {
  try {
    const { title, author, description, genre, publishedYear } = req.body;

    // Book is already attached to req by middleware
    const book = req.book;

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (genre) book.genre = genre;
    if (publishedYear) book.publishedYear = publishedYear;

    await book.save();

    // Populate user information
    await book.populate('addedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    console.error('Update book error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating book',
      error: error.message,
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Only book creator)
const deleteBook = async (req, res) => {
  try {
    // Book is already attached to req by middleware
    const book = req.book;

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book',
      error: error.message,
    });
  }
};

// @desc    Get books added by logged-in user
// @route   GET /api/books/my-books
// @access  Private
const getMyBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments({ addedBy: req.user._id });
    const totalPages = Math.ceil(totalBooks / limit);

    const books = await Book.find({ addedBy: req.user._id })
      .populate('addedBy', 'name email')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: books.length,
      totalBooks,
      totalPages,
      currentPage: page,
      data: books,
    });
  } catch (error) {
    console.error('Get my books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your books',
      error: error.message,
    });
  }
};

// @desc    Get all available genres
// @route   GET /api/books/genres
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = [
      'Fiction',
      'Non-Fiction',
      'Mystery',
      'Thriller',
      'Romance',
      'Science Fiction',
      'Fantasy',
      'Horror',
      'Biography',
      'History',
      'Self-Help',
      'Business',
      'Poetry',
      'Drama',
      'Adventure',
      'Other',
    ];

    res.status(200).json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching genres',
      error: error.message,
    });
  }
};

export default {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyBooks,
  getGenres,
};