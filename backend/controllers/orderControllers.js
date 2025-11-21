import Order from "../models/order.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
import {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
} from "../utils/emailService.js";

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(`Error fetching orders: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching orders.",
    });
  }
};

const getOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Could not find any order matching the ID",
    });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(`Error fetching order: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createOrder = async (req, res) => {
  const { customerName, customerEmail, items } = req.body;

  if (!customerName || !customerEmail || !items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide customer name, email, and items",
    });
  }

  try {
    // Calculate total and validate products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      if (!product.available) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is currently unavailable`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const newOrder = new Order({
      customerName,
      customerEmail,
      items: orderItems,
      totalAmount,
      status: "processing",
    });

    await newOrder.save();

    // Send order confirmation email
    sendOrderConfirmation(newOrder);

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: newOrder,
    });
  } catch (error) {
    console.error(`Error creating order: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Could not find an order by that ID",
    });
  }

  if (!status || !["processing", "ready"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be 'processing' or 'ready'",
    });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Send status update email
    sendOrderStatusUpdate(order);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: order,
    });
  } catch (error) {
    console.error(`Error updating order status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal Server error during order update",
    });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Could not find an order by that ID",
    });
  }

  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({ success: true, message: "Order deleted!" });
  } catch (error) {
    console.error(`Error deleting order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server Error during order deletion",
    });
  }
};

export { getAllOrders, getOrder, createOrder, updateOrderStatus, deleteOrder };
