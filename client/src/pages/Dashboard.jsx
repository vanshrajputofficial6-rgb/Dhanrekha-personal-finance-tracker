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
import {
  getSummary,
  getCategoryBreakdown,
} from "../services/transactionService";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    </>
  );
}