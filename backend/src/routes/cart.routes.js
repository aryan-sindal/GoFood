const express = require("express");
const router = express.Router();

const userAuth = require("../middleware/userAuth");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cart.controller");

// All cart routes require user authentication.
router.use(userAuth);

router.get("/", getCart);
router.post("/add", addToCart);
router.patch("/update", updateCartItem);
router.delete("/remove", removeCartItem);
router.delete("/clear", clearCart);

module.exports = router;
