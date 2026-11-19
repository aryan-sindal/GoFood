
const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Food = require("../models/items.model");

// Get the logged-in user's cart, or create an empty one.
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
}

// Populate food details before sending the cart to frontend.
async function getPopulatedCart(cartId) {
  return Cart.findById(cartId).populate(
    "items.food",
    "name img restaurantId options"
  );
}

// GET: Get user's cart
async function getCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const populatedCart = await getPopulatedCart(cart._id);

    return res.status(200).json({ cart: populatedCart });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
}

// POST: Add food to cart
async function addToCart(req, res) {
  try {
    const { foodId, option, quantity = 1 } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(foodId) ||
      typeof option !== "string" ||
      !option.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        message: "Invalid food, option, or quantity",
      });
    }

    // Find the actual food in database.
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    // Find the selected option and get its actual price.
    const selectedOption = food.options.find(
      (item) => item.type === option.trim()
    );

    if (!selectedOption) {
      return res.status(400).json({
        message: "Selected option is not available",
      });
    }

    const cart = await getOrCreateCart(req.user._id);

    // Check whether the same food with the same option already exists.
    const existingItem = cart.items.find(
      (item) =>
        item.food.toString() === foodId &&
        item.option === selectedOption.type
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        food: food._id,
        option: selectedOption.type,
        quantity,
        amount: selectedOption.price,
      });
    }

    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    return res.status(200).json({
      message: "Item added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
}

// PATCH: Update item quantity
async function updateCartItem(req, res) {
  try {
    const { foodId, option, quantity } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(foodId) ||
      typeof option !== "string" ||
      !option.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        message: "Invalid food, option, or quantity",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) =>
        item.food.toString() === foodId &&
        item.option === option.trim()
    );

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    return res.status(200).json({
      message: "Cart quantity updated",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update cart",
      error: error.message,
    });
  }
}

// DELETE: Remove a particular item from cart
async function removeCartItem(req, res) {
  try {
    const { foodId, option } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(foodId) ||
      typeof option !== "string" ||
      !option.trim()
    ) {
      return res.status(400).json({
        message: "Invalid food or option",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.food.toString() === foodId &&
          item.option === option.trim()
        )
    );

    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    return res.status(200).json({
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove item",
      error: error.message,
    });
  }
}

// DELETE: Clear entire cart
async function clearCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user._id);

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
