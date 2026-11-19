const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const itemsSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    // Kept for compatibility with the original project.
    categoryName: { type: String, trim: true },
    CategoryName: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true },
    options: { type: [optionSchema], default: [] },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true, strict: false }
);

itemsSchema.index({ restaurantId: 1, categoryId: 1 });

module.exports = mongoose.model("food_items", itemsSchema);
