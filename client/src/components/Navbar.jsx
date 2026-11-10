import { Link, NavLink, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import ProfileMenu from "./ProfileMenu";
import ThemeToggle from "./ThemeToggle";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const loggedIn = isLoggedIn(location.pathname);

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        💰 धनरेखा
      </Link>
      <nav className="navbar__links">
        {loggedIn && (
          <>
            <NavLink
              to="/"
              end
              onClick={() => localStorage.removeItem("dashboardMonth")}
            >
              Dashboard
            </NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
          </>
        )}
        <ThemeToggle />
        {loggedIn && <ProfileMenu />}
      </nav>
    </header>
  );
}