import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    img: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
