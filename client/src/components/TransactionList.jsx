export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return <p className="status-text">No transactions match these filters.</p>;
  }

  return (
    <div className="transaction-list">
      {transactions.map((t) => (
        <div key={t._id} className={`transaction-row transaction-row--${t.type}`}>
          <div className="transaction-row__info">
            <strong>{t.description || t.category}</strong>
            <span className="status-text">
              {t.category} · {new Date(t.date).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div className="transaction-row__amount">
            {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
          </div>
          <div className="transaction-row__actions">
            <button className="button--ghost" onClick={() => onEdit(t)}>Edit</button>
            <button className="button--danger" onClick={() => onDelete(t._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}