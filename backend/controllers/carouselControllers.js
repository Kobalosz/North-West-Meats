import Carousel from '../models/Carousel.js';

// Get all active carousel slides (public)
export const getActiveCarouselSlides = async (req, res) => {
  try {
    const slides = await Carousel.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: slides });
  } catch (error) {
    console.error('Error fetching active carousel slides:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch carousel slides' });
  }
};

// Get all carousel slides (admin)
export const getAllCarouselSlides = async (req, res) => {
  try {
    const slides = await Carousel.find().sort({ order: 1 });
    res.json({ success: true, data: slides });
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch carousel slides' });
  }
};

// Create new carousel slide (admin)
export const createCarouselSlide = async (req, res) => {
  try {
    const { title, description, image, link, order, active } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required' });
    }

    const slide = new Carousel({
      title,
      description,
      image,
      link,
      order: order || 0,
      active: active !== undefined ? active : true,
    });

    await slide.save();
    res.status(201).json({ success: true, data: slide });
  } catch (error) {
    console.error('Error creating carousel slide:', error);
    res.status(500).json({ success: false, message: 'Failed to create carousel slide' });
  }
};

// Update carousel slide (admin)
export const updateCarouselSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, link, order, active } = req.body;

    const slide = await Carousel.findByIdAndUpdate(
      id,
      { title, description, image, link, order, active },
      { new: true, runValidators: true }
    );

    if (!slide) {
      return res.status(404).json({ success: false, message: 'Carousel slide not found' });
    }

    res.json({ success: true, data: slide });
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    res.status(500).json({ success: false, message: 'Failed to update carousel slide' });
  }
};

// Delete carousel slide (admin)
export const deleteCarouselSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await Carousel.findByIdAndDelete(id);

    if (!slide) {
      return res.status(404).json({ success: false, message: 'Carousel slide not found' });
    }

    res.json({ success: true, message: 'Carousel slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    res.status(500).json({ success: false, message: 'Failed to delete carousel slide' });
  }
};
