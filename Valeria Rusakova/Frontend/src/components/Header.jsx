// Header.jsx - top bar with the system name and the main navigation menu.
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="logo" aria-label="ValGPT - לדף הבית">
        <span className="logo-icon" aria-hidden="true">✦</span>
        ValGPT
      </NavLink>

      {/* NavLink automatically adds the "active" class to the current page link */}
      <nav aria-label="תפריט ראשי">
        <ul className="nav-list">
          <li>
            <NavLink to="/" end className="nav-link">
              דף הבית
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link">
              אודות
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
