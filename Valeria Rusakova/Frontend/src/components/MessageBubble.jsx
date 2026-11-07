// MessageBubble.jsx - shows ONE message.
// User messages and AI messages get different classes, so they look and sit differently.

function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "message-row user" : "message-row assistant"}>
      <div className="avatar" aria-hidden="true">
        {isUser ? "את/ה" : "✦"}
      </div>

      <div className="bubble">
        {/* Hidden text for screen readers, so they announce who is speaking */}
        <span className="visually-hidden">{isUser ? "את/ה כתבת:" : "ValGPT עונה:"}</span>
        {/* dir="auto" shows English answers left-to-right and Hebrew right-to-left */}
        <p dir="auto">{content}</p>
      </div>
    </div>
  );
}

export default MessageBubble;
