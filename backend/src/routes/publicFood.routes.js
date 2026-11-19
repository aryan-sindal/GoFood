const express = require("express");
const { getPublicFoods } = require("../controllers/publicFood.controller");

const router = express.Router();

router.get("/", getPublicFoods);

module.exports = router;
