// WelcomeScreen.jsx - the friendly screen shown before the first message.
// Clicking a suggestion sends it as the first message.

const SUGGESTIONS = [
  "מהי בירת צרפת?",
  "תסביר לי מה זה API במילים פשוטות",
  "תן לי רעיון לארוחת ערב מהירה",
];

function WelcomeScreen({ onSuggestionClick, isLoading }) {
  return (
    <div className="welcome">
      <div className="welcome-icon" aria-hidden="true">✦</div>
      <h1>שלום! אני ValGPT</h1>
      <p>אפשר לשאול אותי כל שאלה. כתבו הודעה למטה או בחרו אחת מההצעות:</p>

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
    </div>
  );
}

export default WelcomeScreen;
