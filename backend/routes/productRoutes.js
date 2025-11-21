import e from "express";
import {
  getAllProducts,
  getProduct,
  newProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const productRouter = e.Router();

// Public routes - customers can view products
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProduct);

// Protected routes - admin only
productRouter.post("/", authMiddleware, newProduct);
productRouter.put("/:id", authMiddleware, updateProduct);
productRouter.delete("/:id", authMiddleware, deleteProduct);

export default productRouter;
