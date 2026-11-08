import { useEffect, useState } from "react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Salary", "Other"];

const emptyForm = {
  amount: "",
  type: "expense",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  description: "",
};

export default function TransactionForm({ onSubmit, editing, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        amount: editing.amount,
        type: editing.type,
        category: editing.category,
        date: editing.date.slice(0, 10),
        description: editing.description || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      if (!editing) setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>{editing ? "Edit transaction" : "Add transaction"}</h3>

      <div className="form-row">
        <label>
          Amount (₹)
          <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} required />
        </label>
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </label>
      </div>

      <label>
        Description
        <input name="description" maxLength={200} value={form.description} onChange={handleChange} />
      </label>

      {error && <p className="status-text status-text--error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button type="button" className="button--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}