export default function BudgetProgress({ item }) {
  const fillClass = item.over ? "budget-bar__fill budget-bar__fill--over" : "budget-bar__fill";

  return (
    <div className="budget-item">
      <div className="budget-item__header">
        <strong>{item.category}</strong>
        <span className="status-text">
          ₹{item.spent.toLocaleString("en-IN")} of ₹{item.limit.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="budget-bar">
        <div className={fillClass} style={{ width: `${item.percent}%` }} />
      </div>
      <span className={item.over ? "status-text status-text--error" : "status-text"}>
        {item.over
          ? `Over by ₹${Math.abs(item.remaining).toLocaleString("en-IN")}`
          : `₹${item.remaining.toLocaleString("en-IN")} left`}
      </span>
    </div>
  );
}