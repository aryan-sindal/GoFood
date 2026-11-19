const Category = require("../models/category.model");
const itemsModel = require("../models/items.model");

async function addCategory(req, res) {
  try {
    const name = req.body.name?.trim();

    if (!name) return res.status(400).json({ message: "Category name is required" });

    const category = await Category.create({
      restaurantId: req.restaurant._id,
      name,
    });

    return res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category already exists" });
    }
    console.error("Add category:", error);
    return res.status(500).json({ message: "Unable to add category" });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find({ restaurantId: req.restaurant._id })
      .sort({ createdAt: 1 })
      .lean();

    return res.json({ message: "Categories fetched successfully", categories });
  } catch (error) {
    console.error("Get categories:", error);
    return res.status(500).json({ message: "Unable to fetch categories" });
  }
}

async function updateCategory(req, res) {
  try {
    const name = req.body.name?.trim();

    if (!name) return res.status(400).json({ message: "Category name is required" });

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.restaurant._id },
      { name },
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ message: "Category not found" });

    await itemsModel.updateMany(
      { restaurantId: req.restaurant._id, categoryId: category._id },
      { $set: { categoryName: category.name, CategoryName: category.name } }
    );

    return res.json({ message: "Category updated successfully", category });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Category already exists" });
    console.error("Update category:", error);
    return res.status(500).json({ message: "Unable to update category" });
  }
}

async function deleteCategory(req, res) {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      restaurantId: req.restaurant._id,
    });

    if (!category) return res.status(404).json({ message: "Category not found" });

    const foodCount = await itemsModel.countDocuments({
      restaurantId: req.restaurant._id,
      categoryId: category._id,
    });

    if (foodCount > 0) {
      return res.status(409).json({
        message: "Move or delete the food in this category before deleting it",
      });
    }

    await Category.deleteOne({ _id: category._id, restaurantId: req.restaurant._id });

    return res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category:", error);
    return res.status(500).json({ message: "Unable to delete category" });
  }
}

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
