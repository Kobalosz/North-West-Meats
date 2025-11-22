import mongoose from 'mongoose';

const marqueeSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient sorting
marqueeSchema.index({ order: 1, active: 1 });

const Marquee = mongoose.model('Marquee', marqueeSchema);

export default Marquee;
