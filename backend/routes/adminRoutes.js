import e from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} from "../controllers/adminControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const adminRouter = e.Router();

// Public routes
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

// Protected route
adminRouter.get("/profile", authMiddleware, getAdminProfile);

export default adminRouter;
