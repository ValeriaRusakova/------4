// ChatPage.jsx - the home page: shows the open conversation.
// All the data and functions come from useChat() (through App.jsx),
// so this file only takes care of what is shown on the screen.
import { useEffect, useRef } from "react";
import MessageBubble from "../components/MessageBubble.jsx";
import MessageInput from "../components/MessageInput.jsx";
import RobotAvatar from "../components/RobotAvatar.jsx";
import WelcomeBanner from "../components/WelcomeBanner.jsx";

function ChatPage({ chat }) {
  const { messages, isLoading, errorMessage, sendUserMessage } = chat;

  // Scroll to the newest message every time the list changes
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <section className="chat" aria-labelledby="chat-heading">
      <h1 id="chat-heading" className="visually-hidden">צ'אט עם ValGPT</h1>

      <div className="messages-scroll">
        <WelcomeBanner
          showSuggestions={messages.length === 0}
          onSuggestionClick={sendUserMessage}
          isLoading={isLoading}
        />

        {/* role="log" + aria-live: screen readers read out new messages automatically */}
        <div className="messages" role="log" aria-live="polite" aria-busy={isLoading} aria-label="הודעות השיחה">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="message-row assistant">
              <div className="avatar" aria-hidden="true">
                <RobotAvatar size={36} />
              </div>
              <div className="bubble typing">
                <span className="visually-hidden">ValGPT חושב...</span>
                <span className="dot" aria-hidden="true"></span>
                <span className="dot" aria-hidden="true"></span>
                <span className="dot" aria-hidden="true"></span>
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}

      <MessageInput onSend={sendUserMessage} isLoading={isLoading} />
    </section>
  );
}

export default ChatPage;
