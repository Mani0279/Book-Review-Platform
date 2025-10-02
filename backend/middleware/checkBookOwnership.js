import Book from '../models/Book.js';

// Middleware to check if user is the owner of the book
const checkBookOwnership = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if the logged-in user is the creator of the book
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this action. Only the book creator can edit or delete this book.',
      });
    }

    // Attach book to request object for use in controller
    req.book = book;
    next();
  } catch (error) {
    console.error('Check ownership error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking book ownership',
      error: error.message,
    });
  }
};

export  { checkBookOwnership };