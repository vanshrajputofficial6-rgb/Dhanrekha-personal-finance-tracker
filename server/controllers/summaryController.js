const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// Builds a date range for "YYYY-MM", or null when no month is given
const monthRange = (month) => {
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;
  const [year, mon] = month.split("-").map(Number);
  return { $gte: new Date(year, mon - 1, 1), $lt: new Date(year, mon, 1) };
};

// GET /api/summary?month=YYYY-MM
const getSummary = async (req, res, next) => {
  try {
    const match = { user: new mongoose.Types.ObjectId(req.user.id) };
    const range = monthRange(req.query.month);
    if (range) match.date = range;

    const totals = await Transaction.aggregate([
      { $match: match },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const income = totals.find((t) => t._id === "income")?.total || 0;
    const expenses = totals.find((t) => t._id === "expense")?.total || 0;

    res.json({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/summary/by-category?month=YYYY-MM
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const match = {
      type: "expense",
      user: new mongoose.Types.ObjectId(req.user.id),
    };
    const range = monthRange(req.query.month);
    if (range) match.date = range;

    const breakdown = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $project: { _id: 0, category: "$_id", total: 1, count: 1 } },
    ]);

    res.json(breakdown);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getCategoryBreakdown };