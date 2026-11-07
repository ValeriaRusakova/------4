// RobotAvatar.jsx - the friendly robot character, drawn in code with SVG.
// The same drawing is used in all sizes: small avatar, welcome banner and sidebar.
import { useId } from "react";

function RobotAvatar({ size = 40 }) {
  // Each robot on the page needs its own gradient id, so we build one with useId().
  // We remove special characters because SVG ids must be simple.
  const gradientId = "robot-gradient-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientColor = `url(#${gradientId})`;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#7c5cff" />
        </linearGradient>
      </defs>

      {/* antenna */}
      <line x1="32" y1="7" x2="32" y2="14" stroke={gradientColor} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="5.5" r="3" fill={gradientColor} />

      {/* headphones */}
      <rect x="3" y="27" width="9" height="16" rx="4.5" fill={gradientColor} />
      <rect x="52" y="27" width="9" height="16" rx="4.5" fill={gradientColor} />

      {/* head */}
      <rect x="9" y="14" width="46" height="40" rx="18" fill="#ffffff" stroke={gradientColor} strokeWidth="2.5" />

      {/* dark face screen */}
      <rect x="15" y="22" width="34" height="24" rx="11" fill="#1b2150" />

      {/* happy eyes and smile */}
      <path d="M21.5 34q4-5 8 0" stroke="#5eead4" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M34.5 34q4-5 8 0" stroke="#5eead4" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M28 39.5q4 3 8 0" stroke="#5eead4" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default RobotAvatar;
