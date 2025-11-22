import Marquee from '../models/Marquee.js';

// Get all active marquee items (public)
export const getActiveMarqueeItems = async (req, res) => {
  try {
    const items = await Marquee.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching active marquee items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch marquee items' });
  }
};

// Get all marquee items (admin)
export const getAllMarqueeItems = async (req, res) => {
  try {
    const items = await Marquee.find().sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching marquee items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch marquee items' });
  }
};

// Create new marquee item (admin)
export const createMarqueeItem = async (req, res) => {
  try {
    const { text, order, active } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const item = new Marquee({
      text,
      order: order || 0,
      active: active !== undefined ? active : true,
    });

    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Error creating marquee item:', error);
    res.status(500).json({ success: false, message: 'Failed to create marquee item' });
  }
};

// Update marquee item (admin)
export const updateMarqueeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, order, active } = req.body;

    const item = await Marquee.findByIdAndUpdate(
      id,
      { text, order, active },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Marquee item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error updating marquee item:', error);
    res.status(500).json({ success: false, message: 'Failed to update marquee item' });
  }
};

// Delete marquee item (admin)
export const deleteMarqueeItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Marquee.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Marquee item not found' });
    }

    res.json({ success: true, message: 'Marquee item deleted successfully' });
  } catch (error) {
    console.error('Error deleting marquee item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete marquee item' });
  }
};
