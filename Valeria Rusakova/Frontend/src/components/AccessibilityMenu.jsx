// AccessibilityMenu.jsx - a button that opens a small panel with
// accessibility options: text size, high contrast, underlined links, stop animations.
// Works fully with the keyboard: Tab to move, Space to choose, Escape to close.
import { useEffect, useRef, useState } from "react";
import { AccessibilityIcon } from "./Icons.jsx";

const FONT_SIZES = [
  { value: "normal", label: "רגיל" },
  { value: "large", label: "גדול" },
  { value: "xlarge", label: "גדול מאוד" },
];

function AccessibilityMenu({ settings, onChangeSetting, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  // While the panel is open: Escape or a click outside closes it.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Move the focus to the first option, so keyboard users start inside the panel
    panelRef.current.querySelector("input").focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current.focus();
      }
    }

    function handleClickOutside(event) {
      const clickedInsidePanel = panelRef.current.contains(event.target);
      const clickedOnButton = buttonRef.current.contains(event.target);
      if (!clickedInsidePanel && !clickedOnButton) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up when the panel closes
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="a11y-menu">
      <button
        ref={buttonRef}
        type="button"
        className="icon-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="הגדרות נגישות"
        title="הגדרות נגישות"
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
      >
        <AccessibilityIcon />
      </button>

      {isOpen && (
        <div id="a11y-panel" ref={panelRef} className="a11y-panel" role="group" aria-labelledby="a11y-title">
          <h2 id="a11y-title" className="a11y-title">הגדרות נגישות</h2>

          <fieldset className="a11y-fieldset">
            <legend>גודל טקסט</legend>
            {FONT_SIZES.map((option) => (
              <label key={option.value} className="a11y-option">
                <input
                  type="radio"
                  name="font-size"
                  value={option.value}
                  checked={settings.fontSize === option.value}
                  onChange={() => onChangeSetting("fontSize", option.value)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>

          <label className="a11y-option">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(event) => onChangeSetting("highContrast", event.target.checked)}
            />
            ניגודיות גבוהה
          </label>

          <label className="a11y-option">
            <input
              type="checkbox"
              checked={settings.underlineLinks}
              onChange={(event) => onChangeSetting("underlineLinks", event.target.checked)}
            />
            הדגשת קישורים
          </label>

          <label className="a11y-option">
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(event) => onChangeSetting("reduceMotion", event.target.checked)}
            />
            עצירת אנימציות
          </label>

          <button type="button" className="a11y-reset" onClick={onReset}>
            איפוס הגדרות נגישות
          </button>
        </div>
      )}
    </div>
  );
}

export default AccessibilityMenu;
