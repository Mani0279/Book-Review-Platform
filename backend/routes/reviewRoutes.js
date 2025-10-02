import { Router } from 'express';
const router = Router();
import reviewController from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import  {checkReviewOwnership}  from '../middleware/checkReviewOwnership.js';

// Public routes
router.get('/book/:bookId', reviewController.getBookReviews);
router.get('/:id', reviewController.getReviewById);

// Protected routes
router.post('/', protect, reviewController.addReview);
router.get('/user/my-reviews', protect, reviewController.getMyReviews);
router.get('/check/:bookId', protect, reviewController.checkUserReview);
router.put('/:id', protect, checkReviewOwnership, reviewController.updateReview);
router.delete('/:id', protect, checkReviewOwnership, reviewController.deleteReview);

export default router;