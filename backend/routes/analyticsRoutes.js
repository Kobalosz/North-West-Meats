import e from "express";
import {
  getAnalytics,
  getProductAnalytics,
} from "../controllers/analyticsControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const analyticsRouter = e.Router();

// All analytics routes are protected - admin only
analyticsRouter.get("/", authMiddleware, getAnalytics);
analyticsRouter.get("/product/:id", authMiddleware, getProductAnalytics);

export default analyticsRouter;
