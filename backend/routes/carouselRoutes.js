import express from 'express';
import {
  getActiveCarouselSlides,
  getAllCarouselSlides,
  createCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
} from '../controllers/carouselControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - get active carousel slides
router.get('/active', getActiveCarouselSlides);

// Protected routes (Admin only)
router.get('/', authMiddleware, getAllCarouselSlides);
router.post('/', authMiddleware, createCarouselSlide);
router.put('/:id', authMiddleware, updateCarouselSlide);
router.delete('/:id', authMiddleware, deleteCarouselSlide);

export default router;
