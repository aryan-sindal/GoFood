const express = require("express");
const restaurantAuth = require("../middleware/restaurantAuth");
const controller = require("../controllers/restaurantFood.controller");

const router = express.Router();

router.use(restaurantAuth);
router.get("/", controller.getFoods);
router.post("/", controller.addFood);
router.patch("/:id", controller.updateFood);
router.delete("/:id", controller.deleteFood);

module.exports = router;
