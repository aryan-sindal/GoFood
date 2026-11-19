const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/restaurant.model");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function signup(req, res) {
  try {
    const { name, email, password, image = "", location = "", description = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await Restaurant.findOne({ email: normalizedEmail });

    if (exists) {
      return res.status(409).json({ message: "Restaurant email already exists" });
    }

    const hash = await bcrypt.hash(password, 12);

    const restaurant = await Restaurant.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hash,
      image,
      location,
      description,
    });

    const token = jwt.sign(
      { restaurantId: restaurant._id.toString(), email: restaurant.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("restaurantToken", token, cookieOptions);

    return res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        image: restaurant.image,
        location: restaurant.location,
        description: restaurant.description,
      },
    });
  } catch (error) {
    console.error("Restaurant signup:", error);
    return res.status(500).json({ message: "Unable to register restaurant" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const restaurant = await Restaurant.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!restaurant) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, restaurant.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { restaurantId: restaurant._id.toString(), email: restaurant.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("restaurantToken", token, cookieOptions);

    return res.json({
      message: "Restaurant logged in successfully",
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        image: restaurant.image,
        location: restaurant.location,
        description: restaurant.description,
      },
    });
  } catch (error) {
    console.error("Restaurant login:", error);
    return res.status(500).json({ message: "Unable to login restaurant" });
  }
}

function logout(req, res) {
  res.clearCookie("restaurantToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  return res.json({ message: "Restaurant logged out successfully" });
}

async function me(req, res) {
  return res.json({ restaurant: req.restaurant });
}

module.exports = { signup, login, logout, me };
