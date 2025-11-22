import express from 'express';
import {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/contactControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - submit inquiry
router.post('/', submitInquiry);

// Protected routes (Admin only)
router.get('/', authMiddleware, getAllInquiries);
router.put('/:id', authMiddleware, updateInquiryStatus);
router.delete('/:id', authMiddleware, deleteInquiry);

export default router;
