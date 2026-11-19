const itemsModel = require("../models/items.model");
const Restaurant = require("../models/restaurant.model");

async function getPublicFoods(req, res) {
  try {
    const foods = await itemsModel.find({}).sort({ createdAt: -1 }).lean();

    const restaurantIds = foods
      .map((food) => food.restaurantId)
      .filter(Boolean);

    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } })
      .select("name image location")
      .lean();

    const restaurantMap = new Map(
      restaurants.map((restaurant) => [String(restaurant._id), restaurant])
    );

    const normalized = foods.map((food) => {
      const restaurant = food.restaurantId
        ? restaurantMap.get(String(food.restaurantId))
        : null;

      return {
        id: String(food._id),
        category: food.categoryName || food.CategoryName || "Other",
        name: food.name,
        img: food.img,
        options: Array.isArray(food.options) ? food.options : [],
        description: food.description || "",
        restaurantId: food.restaurantId ? String(food.restaurantId) : null,
        restaurantName: restaurant?.name || "GoFood Kitchen",
      };
    });

    return res.json({ foods: normalized });

  } catch (error) {
    console.error("Public foods:", error);
    return res.status(500).json({ message: "Unable to fetch foods" });
  }
}

module.exports = { getPublicFoods };
