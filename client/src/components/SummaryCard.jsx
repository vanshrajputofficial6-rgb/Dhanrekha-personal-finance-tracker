export default function SummaryCard({ label, value, variant }) {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <div className={`summary-card summary-card--${variant}`}>
      <p className="summary-card__label">{label}</p>
      <p className="summary-card__value">{formatted}</p>
    </div>
  );
}