// RobotAvatar.jsx - the friendly robot character (from the image in src/assets).
// The same component is used in all sizes: small avatar, welcome banner, sidebar and About page.
// Small sizes show only the robot's head, so it stays clear and recognizable.
import robotImage from "../assets/robot.png";
import robotHeadImage from "../assets/robot-head.png";

function RobotAvatar({ size = 40 }) {
  const isSmall = size < 48;

  return (
    <img
      src={isSmall ? robotHeadImage : robotImage}
      width={size}
      height={size}
      alt="" // decoration only - the text next to the robot already says "ValGPT"
      draggable="false"
      style={{
        display: "block",
        objectFit: "cover",
        borderRadius: isSmall ? "50%" : "22%", // round edges hide the image's light background
      }}
    />
  );
}

export default RobotAvatar;
