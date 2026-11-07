// MessageBubble.jsx - shows ONE message.
// User messages: blue bubble on the right. AI messages: light bubble on the left.
// AI answers can contain Markdown (lists, bold text), so we show them with ReactMarkdown.
// If the AI created an image, it is shown inside the bubble.
import ReactMarkdown from "react-markdown";
import RobotAvatar from "./RobotAvatar.jsx";
import { UserIcon } from "./Icons.jsx";
import { API_BASE_URL } from "../services/api.js";
import { formatTime } from "../utils/formatTime.js";

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "message-row user" : "message-row assistant"}>
      <div className="avatar" aria-hidden="true">
        {isUser ? <UserIcon /> : <RobotAvatar size={36} />}
      </div>

      <div className="bubble-column">
        <div className="bubble">
          {/* Hidden text for screen readers, so they announce who is speaking */}
          <span className="visually-hidden">{isUser ? "את/ה כתבת:" : "ValGPT עונה:"}</span>

          {/* dir="auto": English text is shown left-to-right, Hebrew right-to-left */}
          {isUser ? (
            <p dir="auto">{message.content}</p>
          ) : (
            <div className="markdown" dir="auto">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {message.image_url && (
            <a
              className="generated-image-link"
              href={API_BASE_URL + message.image_url}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="generated-image"
                src={API_BASE_URL + message.image_url}
                alt="תמונה שנוצרה על ידי ValGPT (התיאור מופיע בהודעה)"
                width="1024"
                height="1024"
                loading="lazy"
              />
              <span className="visually-hidden">פתיחת התמונה בגודל מלא בלשונית חדשה</span>
            </a>
          )}
        </div>

        {/* The temporary message (before the server answers) has no time yet */}
        {message.created_at && (
          <time className="message-time" dateTime={message.created_at}>
            {formatTime(message.created_at)}
          </time>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
