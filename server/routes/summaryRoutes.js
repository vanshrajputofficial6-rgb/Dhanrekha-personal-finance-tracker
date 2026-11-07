const express = require("express");
const router = express.Router();
const {
  getSummary,
  getCategoryBreakdown,
} = require("../controllers/summaryController");

router.get("/", getSummary);
router.get("/by-category", getCategoryBreakdown);

module.exports = router;