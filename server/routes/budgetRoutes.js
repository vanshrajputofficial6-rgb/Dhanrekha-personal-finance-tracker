const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getBudgetStatus,
  getBudgets,
  upsertBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.use(protect);

router.get("/status", getBudgetStatus);
router.route("/").get(getBudgets).put(upsertBudget);
router.delete("/:id", deleteBudget);

module.exports = router;