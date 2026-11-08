require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const errorHandler = require("./middleware/errorHandler");
const summaryRoutes = require("./routes/summaryRoutes");
const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

const Transaction = require("./models/Transaction");

app.get("/api/test-transaction", async (req, res) => {
  try {
    const sample = await Transaction.create({
      amount: 250,
      type: "expense",
      category: "Food",
      description: "Test lunch",
    });
    const all = await Transaction.find();
    res.json({ saved: sample, totalInDb: all.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});