// hooks/useSettings.js
// Display settings: light/dark mode + accessibility options.
// They are saved in the browser (localStorage), so they stay after a refresh.
// Each setting is written on the <html> tag as a data-attribute
// (for example data-theme="dark"), and App.css changes the look according to it.
import { useEffect, useState } from "react";

const STORAGE_KEY = "valgpt-settings";

function getDefaultSettings() {
  // Start in dark mode if the computer itself is set to dark mode.
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return {
    theme: prefersDark ? "dark" : "light",
    fontSize: "normal", // "normal" | "large" | "xlarge"
    highContrast: false,
    underlineLinks: false,
    reduceMotion: false,
  };
}

function loadSettings() {
  const defaults = getDefaultSettings();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaults, ...saved };
  } catch {
    return defaults;
  }
}

function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  // Every time a setting changes: update the <html> tag and save.
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = settings.theme;
    html.dataset.fontSize = settings.fontSize;
    html.dataset.contrast = settings.highContrast ? "high" : "normal";
    html.dataset.underlineLinks = String(settings.underlineLinks);
    html.dataset.reduceMotion = String(settings.reduceMotion);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function updateSetting(name, value) {
    setSettings((previous) => ({ ...previous, [name]: value }));
  }

  function toggleTheme() {
    updateSetting("theme", settings.theme === "dark" ? "light" : "dark");
  }

  // Reset the accessibility options (the light/dark choice is kept).
  function resetAccessibility() {
    setSettings({ ...getDefaultSettings(), theme: settings.theme });
  }

  return { settings, updateSetting, toggleTheme, resetAccessibility };
}

export default useSettings;
