// ChatPage.jsx - the home page: the chat itself.
// It keeps the current conversation id and its messages, and talks to the server.
import { useEffect, useRef, useState } from "react";
import MessageBubble from "../components/MessageBubble.jsx";
import MessageInput from "../components/MessageInput.jsx";
import WelcomeScreen from "../components/WelcomeScreen.jsx";
import { createConversation, sendMessage } from "../services/api.js";

function ChatPage() {
  // null = no conversation yet. It is created on the first message or by "new chat".
  // After a page refresh this starts as null again -> the screen is clean,
  // but old conversations stay saved in MySQL.
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Scroll to the newest message every time the list changes
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // "New chat" button: create a new conversation on the server and clear the screen.
  async function handleNewChat() {
    setErrorMessage("");
    try {
      const conversation = await createConversation();
      setConversationId(conversation.id);
      setMessages([]);
      document.getElementById("message-input")?.focus();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  // Send a message. Returns true if it worked (MessageInput then clears the box).
  async function handleSend(text) {
    setErrorMessage("");
    setIsLoading(true);

    // Show the user's message right away, before the AI answers.
    const temporaryMessage = { id: "pending", role: "user", content: text };
    setMessages((previous) => [...previous, temporaryMessage]);

    try {
      // First message ever -> create the conversation first.
      let currentId = conversationId;
      if (currentId === null) {
        const conversation = await createConversation();
        currentId = conversation.id;
        setConversationId(currentId);
      }

      const reply = await sendMessage(currentId, text);

      // Replace the temporary message with the real saved one + add the AI answer.
      setMessages((previous) => [
        ...previous.filter((message) => message.id !== "pending"),
        reply.user_message,
        reply.assistant_message,
      ]);
      return true;
    } catch (error) {
      // Remove the temporary message; the text stays in the input box to try again.
      setMessages((previous) => previous.filter((message) => message.id !== "pending"));
      setErrorMessage(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="chat" aria-label="צ'אט">
      <div className="chat-toolbar">
        <span className="conversation-label">
          {conversationId ? `שיחה מספר ${conversationId}` : "שיחה חדשה"}
        </span>
        <button
          type="button"
          className="new-chat-button"
          onClick={handleNewChat}
          disabled={isLoading}
        >
          <span aria-hidden="true">＋</span> שיחה חדשה
        </button>
      </div>

      {/* role="log" + aria-live: screen readers read out new messages automatically */}
      <div className="messages" role="log" aria-live="polite" aria-busy={isLoading}>
        {messages.length === 0 && !isLoading ? (
          <WelcomeScreen onSuggestionClick={handleSend} isLoading={isLoading} />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} role={message.role} content={message.content} />
          ))
        )}

        {isLoading && (
          <div className="message-row assistant">
            <div className="avatar" aria-hidden="true">✦</div>
            <div className="bubble typing">
              <span className="visually-hidden">ValGPT חושב...</span>
              <span className="dot" aria-hidden="true"></span>
              <span className="dot" aria-hidden="true"></span>
              <span className="dot" aria-hidden="true"></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}

      <MessageInput onSend={handleSend} isLoading={isLoading} />
    </section>
  );
}

export default ChatPage;
