import e from "express";
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const orderRouter = e.Router();

// Public route - customers can create orders
orderRouter.post("/", createOrder);

// Protected routes - admin only
orderRouter.get("/", authMiddleware, getAllOrders);
orderRouter.get("/:id", authMiddleware, getOrder);
orderRouter.put("/:id", authMiddleware, updateOrderStatus);
orderRouter.delete("/:id", authMiddleware, deleteOrder);

export default orderRouter;
