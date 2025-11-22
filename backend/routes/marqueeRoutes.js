import express from 'express';
import {
  getActiveMarqueeItems,
  getAllMarqueeItems,
  createMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
} from '../controllers/marqueeControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - get active marquee items
router.get('/active', getActiveMarqueeItems);

// Protected routes (Admin only)
router.get('/', authMiddleware, getAllMarqueeItems);
router.post('/', authMiddleware, createMarqueeItem);
router.put('/:id', authMiddleware, updateMarqueeItem);
router.delete('/:id', authMiddleware, deleteMarqueeItem);

export default router;
