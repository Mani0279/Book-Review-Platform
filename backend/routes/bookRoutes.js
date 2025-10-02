import { Router } from 'express';
const router = Router();
import bookController from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';
import {checkBookOwnership} from '../middleware/checkBookOwnership.js';
console.log('protect:', protect);
console.log('checkBookOwnership:', checkBookOwnership);
console.log('bookController.updateBook:', bookController.updateBook);
// Public routes
router.get('/', bookController.getAllBooks);
router.get('/genres', bookController.getGenres);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/', protect, bookController.addBook);
router.get('/user/my-books', protect, bookController.getMyBooks);
router.put('/:id', protect, checkBookOwnership, bookController.updateBook);
router.delete('/:id', protect, checkBookOwnership, bookController.deleteBook);



export default router;