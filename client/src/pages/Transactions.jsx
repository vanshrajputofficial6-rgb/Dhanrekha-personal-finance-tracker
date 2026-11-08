import { useCallback, useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TransactionFilters from "../components/TransactionFilters";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ type: "", category: "" });

  const loadTransactions = useCallback(async () => {
  try {
    setError("");
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    const data = await getTransactions(params);
    setTransactions(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSubmit = async (data) => {
    if (editing) {
      await updateTransaction(editing._id, data);
      setEditing(null);
    } else {
      await createTransaction(data);
    }
    await loadTransactions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      if (editing?._id === id) setEditing(null);
      await loadTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

 return (
  <>
    <TransactionForm
      onSubmit={handleSubmit}
      editing={editing}
      onCancel={() => setEditing(null)}
    />

    <TransactionFilters filters={filters} onChange={setFilters} />

    {error && <p className="status-text status-text--error">{error}</p>}

    {loading ? (
      <p className="status-text">Loading transactions...</p>
    ) : (
      <TransactionList
        transactions={transactions}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    )}
  </>
)}