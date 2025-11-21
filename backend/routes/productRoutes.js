import e from "express";
import {
  getAllProducts,
  getProduct,
  newProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productControllers.js";

const productRouter = e.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/", newProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
