import Product from "../models/product.js";
import mongoose from "mongoose";

const getAllProducts = async (req, res) => {
  try {
    const prdcts = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: prdcts });
  } catch (error) {
    console.error();
    res.status(500).json({
      success: false,
      message: "Internal Server Error returning the Products.",
    });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Could not find any products matching the ID",
    });
  }

  try {
    const prdct = await Product.findById(id);
    res
      .status(200)
      .json({ success: true, message: `Found Product: ${prdct.data}` });
  } catch (error) {
    console.error();
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const newProduct = async (req, res) => {
  const product = req.body;
  if (!product.name || !product.price || !product.img) {
    return res.status(400).json({
      success: false,
      message: "Please fill empty product parameters",
    });
  }
  const newProduct = new Product(product);
  try {
    await newProduct.save();
    res.status(201).json({
      success: true,
      message: `Your ${newProduct.name} has been created!`,
    });
  } catch (error) {
    console.error(`There was an error creating the product:  ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Could not find a product by that ID" });
  }

  try {
    await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({
      success: true,
      message: "Your product was successfully updated!",
    });
  } catch (error) {
    console.error();
    res.status(500).json({
      success: false,
      message: "Internal Server error during product update, please try again",
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Could not find a product by that ID" });
  }

  try {
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: `Your product was deleted!` });
  } catch (error) {
    console.error();
    res.status(500).json({
      success: false,
      message: `Internal server Error during attempt to delete product: ${id}`,
    });
  }
};

export { getAllProducts, getProduct, newProduct, updateProduct, deleteProduct };
