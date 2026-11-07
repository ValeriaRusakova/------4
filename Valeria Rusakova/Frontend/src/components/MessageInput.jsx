// MessageInput.jsx - the text box and the "send" button at the bottom of the chat.
import { useState } from "react";

function MessageInput({ onSend, isLoading }) {
  const [text, setText] = useState("");

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    const trimmedText = text.trim();
    if (trimmedText === "" || isLoading) {
      return;
    }

    // onSend returns true if the message was sent. Only then we empty the box,
    // so if there was an error the user does not lose what they wrote.
    const wasSent = await onSend(trimmedText);
    if (wasSent) {
      setText("");
    }
  }

  // Enter = send, Shift+Enter = new line
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit(event);
    }
  }

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <label htmlFor="message-input" className="visually-hidden">
        כתבו הודעה
      </label>
      <textarea
        id="message-input"
        className="message-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="כתבו הודעה..."
        rows={1}
        maxLength={4000}
        disabled={isLoading}
        autoFocus
      />
      <button
        type="submit"
        className="send-button"
        disabled={isLoading || text.trim() === ""}
        aria-label="שליחת הודעה"
      >
        {isLoading ? "..." : "שליחה"}
      </button>
    </form>
  );
}

export default MessageInput;
