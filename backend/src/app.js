const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // cross origin resource sharing

const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const publicFoodRoutes = require("./routes/publicFood.routes");
const restaurantFoodRoutes = require("./routes/restaurantFood.routes");
const restaurantAuthRoutes = require("./routes/restaurantAuth.routes");
const restaurantCategoryRoutes = require("./routes/restaurantCategory.routes");

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "gofood-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/foods", publicFoodRoutes);
app.use("/api/restaurant/auth", restaurantAuthRoutes);
app.use("/api/restaurant/categories", restaurantCategoryRoutes);
app.use("/api/restaurant/foods", restaurantFoodRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;
