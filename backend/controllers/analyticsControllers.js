import Order from "../models/order.js";
import Product from "../models/product.js";

// Get overall analytics
const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const productAnalytics = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.name" },
          totalSales: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderFrequency: { $sum: 1 },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select("customerName totalAmount status createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        productAnalytics,
        recentOrders,
      },
    });
  } catch (error) {
    console.error(`Error fetching analytics: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching analytics",
    });
  }
};

// Get product-specific analytics
const getProductAnalytics = async (req, res) => {
  const { id } = req.params;

  try {
    const productStats = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.product": id } },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.name" },
          totalSales: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderFrequency: { $sum: 1 },
        },
      },
    ]);

    if (productStats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sales data found for this product",
      });
    }

    res.status(200).json({
      success: true,
      data: productStats[0],
    });
  } catch (error) {
    console.error(`Error fetching product analytics: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching product analytics",
    });
  }
};

export { getAnalytics, getProductAnalytics };
