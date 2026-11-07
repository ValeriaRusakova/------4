// WelcomeBanner.jsx - the welcome card at the top of the chat.
// When the conversation is still empty it also shows example questions.
import RobotAvatar from "./RobotAvatar.jsx";
import { LightbulbIcon, SparkleIcon } from "./Icons.jsx";

const SUGGESTIONS = [
  "מהי בירת צרפת?",
  "תסביר לי מה זה API במילים פשוטות",
  "צור תמונה של חתול אסטרונאוט בחלל",
];

function WelcomeBanner({ showSuggestions, onSuggestionClick, isLoading }) {
  return (
    <div className="welcome-banner">
      {/* decoration only */}
      <span className="banner-sparkle sparkle-1" aria-hidden="true"><SparkleIcon size={22} /></span>
      <span className="banner-sparkle sparkle-2" aria-hidden="true"><SparkleIcon size={16} /></span>

      <div className="welcome-avatar">
        <RobotAvatar size={52} />
      </div>
      <h2 className="welcome-title">
        ברוכים הבאים ל-<span className="gradient-text">ValGPT</span>
      </h2>
      <p className="welcome-text">התחילו שיחה עם הצ'אט, שאלו שאלות, קבלו תשובות – ואפילו בקשו תמונות!</p>

      <p className="welcome-tip">
        <LightbulbIcon />
        אפשר לשאול אותי כל דבר – ממידע כללי ועד עזרה בתכנות, לימודים ורעיונות.
      </p>

      {showSuggestions && (
        <div className="suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="suggestion"
              onClick={() => onSuggestionClick(suggestion)}
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default WelcomeBanner;
