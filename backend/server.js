import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
