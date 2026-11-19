const Category = require("../models/category.model");
const itemsModel = require("../models/items.model");

function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];
  return options
    .map((option) => ({
      type: String(option.type ?? "").trim(),
      price: Number(option.price),
    }))
    .filter((option) => option.type && Number.isFinite(option.price) && option.price >= 0);
}

async function addFood(req, res) {
  try { 
    const { categoryId, name, img, description = "" } = req.body;
    const options = normalizeOptions(req.body.options);

    if (!categoryId || !name?.trim() || !img?.trim()) {
      return res.status(400).json({ message: "categoryId, name and image are required" });
    }

    const category = await Category.findOne({
      _id: categoryId,
      restaurantId: req.restaurant._id,
    });

    if (!category) return res.status(404).json({ message: "Category not found" });

    const food = await itemsModel.create({
      restaurantId: req.restaurant._id,
      categoryId: category._id,
      categoryName: category.name,
      CategoryName: category.name,
      name: name.trim(),
      img: img.trim(),
      options,
      description: description.trim(),
    });

    return res.status(201).json({ message: "Food added successfully", food });
  } catch (error) {
    console.error("Add food:", error);
    return res.status(500).json({ message: "Unable to add food" });
  }
}

async function getFoods(req, res) {
  try {
    const foods = await itemsModel.find({ restaurantId: req.restaurant._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ message: "Foods fetched successfully", foods });
  } catch (error) {
    console.error("Get foods:", error);
    return res.status(500).json({ message: "Unable to fetch foods" });
  }
}

async function updateFood(req, res) {
  try {
    const { categoryId, name, img, description = "" } = req.body;
    const options = normalizeOptions(req.body.options);

    if (!categoryId || !name?.trim() || !img?.trim()) {
      return res.status(400).json({ message: "categoryId, name and image are required" });
    }

    const category = await Category.findOne({
      _id: categoryId,
      restaurantId: req.restaurant._id,
    });

    if (!category) return res.status(404).json({ message: "Category not found" });

    const food = await itemsModel.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.restaurant._id },
      {
        categoryId: category._id,
        categoryName: category.name,
        CategoryName: category.name,
        name: name.trim(),
        img: img.trim(),
        options,
        description: description.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!food) return res.status(404).json({ message: "Food not found" });

    return res.json({ message: "Food updated successfully", food });
  } catch (error) {
    console.error("Update food:", error);
    return res.status(500).json({ message: "Unable to update food" });
  }
}

async function deleteFood(req, res) {
  try {
    const food = await itemsModel.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.restaurant._id,
    });

    if (!food) return res.status(404).json({ message: "Food not found" });

    return res.json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Delete food:", error);
    return res.status(500).json({ message: "Unable to delete food" });
  }
}

module.exports = { addFood, getFoods, updateFood, deleteFood };
