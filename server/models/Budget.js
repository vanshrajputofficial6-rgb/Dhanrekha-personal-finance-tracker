const mongoose = require("mongoose");
const { CATEGORIES } = require("./Transaction");

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: CATEGORIES,
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format"],
    },
    limit: {
      type: Number,
      required: [true, "Limit is required"],
      min: [1, "Limit must be at least 1"],
    },
  },
  { timestamps: true }
);

// One budget per category per month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);