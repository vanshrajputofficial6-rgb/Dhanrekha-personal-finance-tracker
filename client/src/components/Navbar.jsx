import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        💰 Finance Tracker
      </Link>
      <nav className="navbar__links">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
      </nav>
    </header>
  );
}