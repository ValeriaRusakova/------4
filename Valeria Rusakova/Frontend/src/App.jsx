// App.jsx - the layout of the whole site:
//   main area (top bar + current page) on the right, sidebar on the left.
// It also holds the shared data: the chat (useChat) and the display settings (useSettings).
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import useChat from "./hooks/useChat.js";
import useSettings from "./hooks/useSettings.js";

function App() {
  const chat = useChat();
  const { settings, updateSetting, toggleTheme, resetAccessibility } = useSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // used on small screens only
  const navigate = useNavigate();

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  // Small screens: Escape closes the sidebar and returns the focus to the menu button.
  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
        document.getElementById("menu-button").focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  // Sidebar actions always bring the user back to the chat page.
  function focusMessageInput() {
    document.getElementById("message-input")?.focus();
  }

  async function handleSelectConversation(id) {
    closeSidebar();
    navigate("/");
    await chat.openConversation(id);
    focusMessageInput();
  }

  async function handleNewChat() {
    closeSidebar();
    navigate("/");
    await chat.startNewChat();
    focusMessageInput();
  }

  return (
    <div className="app">
      {/* Accessibility: keyboard users can jump straight to the main content */}
      <a href="#main-content" className="skip-link">
        דלגו לתוכן הראשי
      </a>

      <div className="main-area">
        <Header
          settings={settings}
          onToggleTheme={toggleTheme}
          onChangeSetting={updateSetting}
          onResetAccessibility={resetAccessibility}
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <main id="main-content" className="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<ChatPage chat={chat} />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Any unknown address shows the chat */}
            <Route path="*" element={<ChatPage chat={chat} />} />
          </Routes>
        </main>
      </div>

      <Sidebar
        conversations={chat.conversations}
        activeConversationId={chat.conversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        isBusy={chat.isLoading}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Dark background behind the open sidebar on small screens (click = close) */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} aria-hidden="true" />}
    </div>
  );
}

export default App;
