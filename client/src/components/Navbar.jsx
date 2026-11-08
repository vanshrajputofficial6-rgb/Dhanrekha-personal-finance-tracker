import { Link, NavLink, useLocation } from "react-router-dom";
import { logout, isLoggedIn } from "../services/authService";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const loggedIn = isLoggedIn(location.pathname);

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        💰 Finance Tracker
      </Link>
      <nav className="navbar__links">
        {loggedIn && (
          <>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <button
              type="button"
              className="button--ghost"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}