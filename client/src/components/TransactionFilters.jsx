const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Salary", "Other"];

export default function TransactionFilters({ filters, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar">
      <label>
        Type
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>
      <label>
        Category
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="button--ghost"
        onClick={() => onChange({ type: "", category: "" })}
      >
        Clear
      </button>
    </div>
  );
}