const express = require("express");
const restaurantAuth = require("../middleware/restaurantAuth");
const controller = require("../controllers/restaurantCategory.controller");

const router = express.Router();

router.use(restaurantAuth);
router.get("/", controller.getCategories);
router.post("/", controller.addCategory);
router.patch("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

module.exports = router;
