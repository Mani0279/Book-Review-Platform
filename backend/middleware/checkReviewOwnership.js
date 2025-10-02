import Review from '../models/Review.js';

// Middleware to check if user is the owner of the review
const checkReviewOwnership = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if the logged-in user is the creator of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this action. Only the review creator can edit or delete this review.',
      });
    }

    // Attach review to request object for use in controller
    req.review = review;
    next();
  } catch (error) {
    console.error('Check review ownership error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking review ownership',
      error: error.message,
    });
  }
};

export  { checkReviewOwnership };