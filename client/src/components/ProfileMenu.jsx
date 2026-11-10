import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../services/transactionService";
import { logout } from "../services/authService";
import "../styles/profile.css";

const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const groupByMonth = (transactions) => {
  const groups = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) {
      groups[key] = {
        key,
        label: d.toLocaleString("en-IN", { month: "long", year: "numeric" }),
        income: 0,
        expense: 0,
        items: [],
      };
    }
    if (t.type === "income") groups[key].income += t.amount;
    else groups[key].expense += t.amount;
    groups[key].items.push(t);
  });
  return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null") || {};

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    getTransactions()
      .then((data) => setHistory(groupByMonth(data)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const openMonth = (key) => {
    setOpen(false);
    navigate(`/?month=${key}`);
  };

  return (
    <div className="profile" ref={ref}>
      <button
        type="button"
        className="profile__avatar"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open profile"
        aria-expanded={open}
      >
        {getInitials(user.name)}
      </button>

      {open && (
        <div className="profile__panel">
          <div className="profile__header">
            <div className="profile__avatar profile__avatar--large">
              {getInitials(user.name)}
            </div>
            <div>
              <strong className="profile__name">{user.name || "User"}</strong>
              <span className="profile__email">{user.email}</span>
            </div>
          </div>

          <h4 className="profile__section-title">Monthly history</h4>

          <div className="profile__history">
            {loading && <p className="profile__muted">Loading history...</p>}
            {error && <p className="profile__error">{error}</p>}
            {!loading && !error && history.length === 0 && (
              <p className="profile__muted">No transactions yet.</p>
            )}

            {history.map((m) => (
              <details key={m.key} className="profile__month">
                <summary>
                  <span className="profile__month-name">{m.label}</span>
                  <span className="profile__summary-right">
                    <button
                      type="button"
                      className="profile__view"
                      onClick={(e) => {
                        e.preventDefault();
                        openMonth(m.key);
                      }}
                    >
                      View
                    </button>
                    <span className={m.income - m.expense >= 0 ? "profile__net profile__net--pos" : "profile__net profile__net--neg"}>
                      {formatINR(m.income - m.expense)}
                    </span>
                  </span>
                </summary>
                <div className="profile__month-totals">
                  <span>Income: {formatINR(m.income)}</span>
                  <span>Expenses: {formatINR(m.expense)}</span>
                </div>
                <ul className="profile__items">
                  {m.items.map((t) => (
                    <li key={t._id}>
                      <span>{t.description || t.category}</span>
                      <span className={t.type === "income" ? "profile__amt--income" : "profile__amt--expense"}>
                        {t.type === "income" ? "+" : "-"}{formatINR(t.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          <button type="button" className="profile__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}