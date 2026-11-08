const express = require("express");
router.use(protect);
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getBudgetStatus,
  getBudgets,
  upsertBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.get("/status", getBudgetStatus);
router.route("/").get(getBudgets).put(upsertBudget);
router.delete("/:id", deleteBudget);

module.exports = router;