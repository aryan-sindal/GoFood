const express = require("express");
const controller = require("../controllers/restaurantAuth.controller");
const restaurantAuth = require("../middleware/restaurantAuth");

const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/me", restaurantAuth, controller.me);

module.exports = router;
