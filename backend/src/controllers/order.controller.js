const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Food = require("../models/items.model");
const Order = require("../models/order.model");

async function placeOrder(req, res) {
  try {
    const { address, paymentMethod = "COD" } = req.body;

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is currently available",
      });
    }

    const requiredFields = [
      "fullName",
      "phone",
      "houseNo",
      "street",
      "city",
      "state",
      "pincode",
    ];

    if (
      !address ||
      typeof address !== "object" ||
      Array.isArray(address) ||
      requiredFields.some(
        (field) =>
          typeof address[field] !== "string" ||
          !address[field].trim()
      )
    ) {
      return res.status(400).json({
        message: "Please provide all required delivery details",
      });
    }

    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      return res.status(400).json({
        message: "Please provide a valid 10-digit mobile number",
      });
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      return res.status(400).json({
        message: "Please provide a valid 6-digit PIN code",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const orderItems = await Promise.all(
      cart.items.map(async (cartItem) => {
        const food = await Food.findById(cartItem.food);

        if (!food) {
          throw new Error("A food item in your cart is no longer available");
        }

        const selectedOption = food.options.find(
          (option) => option.type === cartItem.option
        );

        if (!selectedOption) {
          throw new Error(
            `${food.name}: selected option is no longer available`
          );
        }

        const price = Number(selectedOption.price);
        const quantity = cartItem.quantity;

        if (
          !Number.isFinite(price) ||
          price < 0 ||
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          throw new Error("Invalid item price or quantity in cart");
        }

        return {
          foodId: food._id,
          restaurantId: food.restaurantId || null,
          name: food.name,
          img: food.img,
          option: selectedOption.type,
          price,
          quantity,
          lineTotal: price * quantity,
        };
      })
    );

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    const deliveryFee = 0;
    const totalAmount = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress: {
        fullName: address.fullName.trim(),
        phone: address.phone.trim(),
        houseNo: address.houseNo.trim(),
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
        landmark: address.landmark?.trim() || "",
      },
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
    });

    try {
      cart.items = [];
      await cart.save();
    } catch (clearError) {
      console.error("Order placed, but cart clearing failed:", clearError);
    }

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(400).json({
      message: error.message || "Failed to place order",
    });
  }
}


// GET: Fetch all orders of the logged-in user
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
}


module.exports = {
  placeOrder, getMyOrders
};
