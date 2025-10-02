import Review from '../models/Review.js';
import Book from '../models/Book.js';

// @desc    Add a review to a book
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;

    // Validation
    if (!bookId || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bookId, rating, and reviewText',
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book. You can edit your existing review.',
      });
    }

    // Create review
    const review = await Review.create({
      bookId,
      userId: req.user._id,
      rating,
      reviewText,
    });

    // Populate user information
    await review.populate('userId', 'name email');
    await review.populate('bookId', 'title');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review,
    });
  } catch (error) {
    console.error('Add review error:', error);

    // Handle duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book',
      });
    }

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
      message: 'Server error while adding review',
      error: error.message,
    });
  }
};

// @desc    Get all reviews for a book
// @route   GET /api/reviews/book/:bookId?page=1&limit=10
// @access  Public
const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Get total count
    const totalReviews = await Review.countDocuments({ bookId });
    const totalPages = Math.ceil(totalReviews / limit);

    // Get reviews
    const reviews = await Review.find({ bookId })
      .populate('userId', 'name email')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: reviews.length,
      totalReviews,
      totalPages,
      currentPage: page,
      averageRating: book.averageRating,
      data: reviews,
    });
  } catch (error) {
    console.error('Get book reviews error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews',
      error: error.message,
    });
  }
};

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('bookId', 'title author');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Get review error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching review',
      error: error.message,
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Only review creator)
const updateReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;

    // Review is already attached to req by middleware
    const review = req.review;

    // Update fields
    if (rating !== undefined) review.rating = rating;
    if (reviewText !== undefined) review.reviewText = reviewText;

    await review.save();

    // Populate user and book information
    await review.populate('userId', 'name email');
    await review.populate('bookId', 'title');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    console.error('Update review error:', error);

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
      message: 'Server error while updating review',
      error: error.message,
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Only review creator)
const deleteReview = async (req, res) => {
  try {
    // Review is already attached to req by middleware
    const review = req.review;
    const bookId = review.bookId;

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review',
      error: error.message,
    });
  }
};

// @desc    Get reviews by logged-in user
// @route   GET /api/reviews/user/my-reviews?page=1&limit=10
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalReviews = await Review.countDocuments({ userId: req.user._id });
    const totalPages = Math.ceil(totalReviews / limit);

    const reviews = await Review.find({ userId: req.user._id })
      .populate('bookId', 'title author')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: reviews.length,
      totalReviews,
      totalPages,
      currentPage: page,
      data: reviews,
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your reviews',
      error: error.message,
    });
  }
};

// @desc    Check if user has reviewed a book
// @route   GET /api/reviews/check/:bookId
// @access  Private
const checkUserReview = async (req, res) => {
  try {
    const { bookId } = req.params;

    const review = await Review.findOne({
      bookId,
      userId: req.user._id,
    }).populate('userId', 'name email');

    res.status(200).json({
      success: true,
      hasReviewed: !!review,
      data: review,
    });
  } catch (error) {
    console.error('Check user review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking review',
      error: error.message,
    });
  }
};

export default {
  addReview,
  getBookReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getMyReviews,
  checkUserReview,
};