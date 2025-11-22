import e from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";
import contactRouter from "./routes/contactRoutes.js";

dotenv.config();

const app = e();

// Middleware
app.use(cors());
app.use(e.json());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("North West Meats API - Server is ready!");
});

// Routes
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/contact", contactRouter);

app.listen(port, () => {
  connectDB();
  console.log("Server started @ port: " + port);
});
