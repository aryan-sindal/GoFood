const jwt = require("jsonwebtoken");
const Restaurant = require("../models/restaurant.model");

async function restaurantAuth(req, res, next) {
  try {
    const token = req.cookies?.restaurantToken;

    if (!token) {
      return res.status(401).json({ message: "Restaurant authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const restaurant = await Restaurant.findById(decoded.restaurantId).select("-password");

    if (!restaurant) {
      return res.status(401).json({ message: "Restaurant not found" });
    }

    req.restaurant = restaurant;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired restaurant session" });
  }
}

module.exports = restaurantAuth;
