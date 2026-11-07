// hooks/useChat.js
// All the chat logic in one place (a "custom hook").
// App.jsx calls useChat() once, and passes the data and functions to the
// Sidebar (list of conversations) and to the ChatPage (the messages).
import { useEffect, useState } from "react";
import { createConversation, getConversations, getMessages, sendMessage } from "../services/api.js";

function useChat() {
  const [conversations, setConversations] = useState([]); // for the sidebar
  const [conversationId, setConversationId] = useState(null); // the open conversation (null = none yet)
  const [messages, setMessages] = useState([]); // messages of the open conversation
  const [isLoading, setIsLoading] = useState(false); // waiting for the AI answer
  const [errorMessage, setErrorMessage] = useState("");

  // Load the sidebar list once, when the site opens.
  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const list = await getConversations();
      setConversations(list);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  // Sidebar click: show an old conversation again (its messages come from MySQL).
  async function openConversation(id) {
    if (isLoading) {
      return;
    }
    setErrorMessage("");
    try {
      const loadedMessages = await getMessages(id);
      setConversationId(id);
      setMessages(loadedMessages);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  // "New chat" button: create a new conversation on the server and clear the screen.
  async function startNewChat() {
    if (isLoading) {
      return;
    }
    setErrorMessage("");
    try {
      const conversation = await createConversation();
      setConversationId(conversation.id);
      setMessages([]);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  // Send a message. Returns true if it worked (MessageInput then clears the box).
  async function sendUserMessage(text) {
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

      // Move this conversation to the top of the sidebar (with its topic title).
      setConversations((previous) => [
        reply.conversation,
        ...previous.filter((conversation) => conversation.id !== reply.conversation.id),
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

  return {
    conversations,
    conversationId,
    messages,
    isLoading,
    errorMessage,
    openConversation,
    startNewChat,
    sendUserMessage,
  };
}

export default useChat;
