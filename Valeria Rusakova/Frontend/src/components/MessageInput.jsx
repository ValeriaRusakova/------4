// MessageInput.jsx - the text box at the bottom of the chat,
// with an "image" shortcut button and a round "send" button.
import { useRef, useState } from "react";
import { ImageIcon, SendIcon } from "./Icons.jsx";

const IMAGE_REQUEST_START = "צור תמונה של ";

function MessageInput({ onSend, isLoading }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    const trimmedText = text.trim();
    if (trimmedText === "" || isLoading) {
      return;
    }

    // Empty the box right away (the message already appears in the chat).
    // onSend returns false if there was an error - then we put the text back,
    // so the user does not lose what they wrote.
    setText("");
    const wasSent = await onSend(trimmedText);
    if (!wasSent) {
      setText(trimmedText);
    }
  }

  // Enter = send, Shift+Enter = new line
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit(event);
    }
  }

  // The image button writes "צור תמונה של " at the start, so the user only adds what to draw
  function handleImageShortcut() {
    if (!text.startsWith(IMAGE_REQUEST_START)) {
      setText(IMAGE_REQUEST_START + text);
    }
    textareaRef.current.focus();
  }

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <button
        type="button"
        className="icon-button"
        onClick={handleImageShortcut}
        aria-label="בקשת תמונה"
        title="בקשת תמונה"
      >
        <ImageIcon />
      </button>

      <label htmlFor="message-input" className="visually-hidden">
        כתבו הודעה
      </label>
      {/* The box stays enabled while waiting, so the keyboard focus is not lost */}
      <textarea
        ref={textareaRef}
        id="message-input"
        className="message-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="הקלידו את ההודעה שלכם..."
        rows={1}
        maxLength={4000}
        dir="auto"
        aria-describedby="input-help"
        autoFocus
      />
      <span id="input-help" className="visually-hidden">
        Enter לשליחה, Shift ו-Enter לשורה חדשה
      </span>

      <button
        type="submit"
        className="send-button"
        disabled={isLoading || text.trim() === ""}
        aria-label="שליחת הודעה"
        title="שליחה"
      >
        <SendIcon />
      </button>
    </form>
  );
}

export default MessageInput;
