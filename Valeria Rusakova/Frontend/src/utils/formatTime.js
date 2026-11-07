// formatTime.js - small helpers that turn server times into short Hebrew text.
// The server sends times in UTC (for example "2026-11-07T16:45:31+00:00");
// the browser converts them to the user's local time automatically.

// "18:45"
export function formatTime(isoText) {
  return new Date(isoText).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

// For the sidebar: today -> "18:45", yesterday -> "אתמול", older -> "5.11"
export function formatSidebarDate(isoText) {
  const date = new Date(isoText);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return formatTime(isoText);
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "אתמול";
  }
  return date.toLocaleDateString("he-IL", { day: "numeric", month: "numeric" });
}
