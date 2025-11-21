import e from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRoutes.js";

dotenv.config();

const app = e();

app.use(e.json());
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is ready!");
});

app.use("/api/products", productRouter);

app.listen(port, () => {
  connectDB();
  console.log("Server started @ port: " + port);
});
