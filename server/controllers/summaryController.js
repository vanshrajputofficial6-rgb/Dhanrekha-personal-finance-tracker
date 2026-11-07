const Transaction = require("../models/Transaction");

// GET /api/summary
const getSummary = async (req, res, next) => {
  try {
    const totals = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
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

// GET /api/summary/by-category
const getCategoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Transaction.aggregate([
      { $match: { type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
          count: 1,
        },
      },
    ]);

    res.json(breakdown);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getCategoryBreakdown };