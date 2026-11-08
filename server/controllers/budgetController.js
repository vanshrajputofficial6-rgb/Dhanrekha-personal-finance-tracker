const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// GET /api/budgets/status?month=YYYY-MM
// Returns each budget for the month with the amount spent so far
const getBudgetStatus = async (req, res, next) => {
  try {
    const month = req.query.month;
    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ message: "Provide month as YYYY-MM" });
    }

    const [year, mon] = month.split("-").map(Number);
    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 1);

    const budgets = await Budget.find({ month }).lean();

    const spent = await Transaction.aggregate([
      { $match: { type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);
    const spentMap = Object.fromEntries(spent.map((s) => [s._id, s.total]));

    const status = budgets.map((b) => {
      const used = spentMap[b.category] || 0;
      return {
        _id: b._id,
        category: b.category,
        limit: b.limit,
        spent: used,
        remaining: b.limit - used,
        percent: Math.min(Math.round((used / b.limit) * 100), 100),
        over: used > b.limit,
      };
    });

    res.json(status);
  } catch (error) {
    next(error);
  }
};

// GET /api/budgets?month=YYYY-MM
const getBudgets = async (req, res, next) => {
  try {
    const filter = req.query.month ? { month: req.query.month } : {};
    const budgets = await Budget.find(filter).sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    next(error);
  }
};

// PUT /api/budgets  body: { category, month, limit }
// Creates the budget, or updates it if one already exists for that category and month
const upsertBudget = async (req, res, next) => {
  try {
    const { category, month, limit } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { category, month },
      { category, month, limit },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(budget);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/budgets/:id
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.json({ message: "Budget deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudgetStatus, getBudgets, upsertBudget, deleteBudget };