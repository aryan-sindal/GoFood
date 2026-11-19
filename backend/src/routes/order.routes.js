const express = require("express");
const userAuth = require("../middleware/userAuth");
const { placeOrder, getMyOrders } = require("../controllers/order.controller");
const router = express.Router();

router.use(userAuth);

router.post("/place", placeOrder);
router.get("/my-orders", getMyOrders);

module.exports = router;
