const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getSummary,
  getCategoryBreakdown,
} = require("../controllers/summaryController");

router.use(protect);

router.get("/", getSummary);
router.get("/by-category", getCategoryBreakdown);

module.exports = router;