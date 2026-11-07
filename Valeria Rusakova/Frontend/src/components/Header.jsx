// Header.jsx - top bar: navigation tabs (Home / About), dark-mode button
// and the accessibility menu. On small screens it also has a menu button
// that opens the sidebar.
import { NavLink } from "react-router-dom";
import AccessibilityMenu from "./AccessibilityMenu.jsx";
import { HomeIcon, InfoIcon, MenuIcon, MoonIcon, SunIcon } from "./Icons.jsx";

function Header({ settings, onToggleTheme, onChangeSetting, onResetAccessibility, isSidebarOpen, onOpenSidebar }) {
  const isDark = settings.theme === "dark";
  const themeLabel = isDark ? "מעבר למצב בהיר" : "מעבר למצב כהה";

  return (
    <header className="topbar">
      <div className="topbar-start">
        {/* Visible only on small screens */}
        <button
          id="menu-button"
          type="button"
          className="icon-button menu-button"
          onClick={onOpenSidebar}
          aria-label="פתיחת היסטוריית השיחות"
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar"
        >
          <MenuIcon />
        </button>

        {/* NavLink automatically adds the "active" class to the link of the current page */}
        <nav aria-label="תפריט ראשי">
          <ul className="tabs">
            <li>
              <NavLink to="/" end className="tab">
                <HomeIcon />
                בית
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="tab">
                <InfoIcon />
                אודות
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        <AccessibilityMenu
          settings={settings}
          onChangeSetting={onChangeSetting}
          onReset={onResetAccessibility}
        />
      </div>
    </header>
  );
}

export default Header;
