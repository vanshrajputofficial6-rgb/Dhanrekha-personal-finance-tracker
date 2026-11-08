import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import SummaryCard from "../components/SummaryCard";
import BudgetProgress from "../components/BudgetProgress";
import {
  getSummary,
  getCategoryBreakdown,
  getBudgetStatus,
  upsertBudget,
} from "../services/transactionService";

const BUDGET_CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [budgetForm, setBudgetForm] = useState({ category: "Food", limit: "" });
  const currentMonth = new Date().toISOString().slice(0, 7);

  const loadBudgets = () =>
    getBudgetStatus(currentMonth).then(setBudgets).catch(() => {});

  useEffect(() => {
    loadBudgets();

    let cancelled = false;

    Promise.all([getSummary(), getCategoryBreakdown()])
      .then(([summaryData, categoryData]) => {
        if (cancelled) return;
        setSummary(summaryData);
        setCategories(categoryData);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBudgetSave = async (e) => {
    e.preventDefault();
    if (!budgetForm.limit) return;
    await upsertBudget({
      category: budgetForm.category,
      month: currentMonth,
      limit: Number(budgetForm.limit),
    });
    setBudgetForm({ ...budgetForm, limit: "" });
    loadBudgets();
  };

  if (loading) return <p className="status-text">Loading dashboard...</p>;
  if (error) return <p className="status-text status-text--error">{error}</p>;

  return (
    <>
      <section className="summary-grid">
        <SummaryCard label="Total Income" value={summary.totalIncome} variant="income" />
        <SummaryCard label="Total Expenses" value={summary.totalExpenses} variant="expense" />
        <SummaryCard label="Balance" value={summary.balance} variant="balance" />
      </section>

      <section className="chart-card">
        <h3>Spending by Category</h3>
        {categories.length === 0 ? (
          <p className="status-text">No expenses yet. Add some transactions to see the chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D1F5EE" />
              <XAxis dataKey="category" stroke="#5B7C78" />
              <YAxis stroke="#5B7C78" />
              <Tooltip />
              <Bar dataKey="total" fill="#0F766E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="budget-card">
        <h3>Monthly Budgets</h3>
        {budgets.length === 0 && (
          <p className="status-text">No budgets set for this month yet.</p>
        )}
        {budgets.map((b) => (
          <BudgetProgress key={b._id} item={b} />
        ))}
        <form className="budget-form" onSubmit={handleBudgetSave}>
          <label>
            Category
            <select
              value={budgetForm.category}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
            >
              {BUDGET_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Monthly limit (₹)
            <input
              type="number"
              min="1"
              value={budgetForm.limit}
              onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
            />
          </label>
          <button type="submit">Set budget</button>
        </form>
      </section>
    </>
  );
}