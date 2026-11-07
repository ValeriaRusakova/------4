// Sidebar.jsx - the side menu: robot card, "new chat" button and the
// history of conversations (by topic). Clicking a conversation opens it again.
import { useEffect, useRef } from "react";
import RobotAvatar from "./RobotAvatar.jsx";
import { ChatIcon, CloseIcon, PlusIcon, SparkleIcon } from "./Icons.jsx";
import { formatSidebarDate } from "../utils/formatTime.js";

function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  isBusy,
  isOpen,
  onClose,
}) {
  // On mobile: when the menu opens, move the keyboard focus into it.
  const newChatButtonRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      newChatButtonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <aside id="sidebar" className={isOpen ? "sidebar open" : "sidebar"} aria-label="תפריט צד">
      {/* Close button - visible only on small screens */}
      <button type="button" className="icon-button sidebar-close" onClick={onClose} aria-label="סגירת התפריט">
        <CloseIcon />
      </button>

      <div className="robot-card">
        <div className="robot-glow">
          <RobotAvatar size={92} />
        </div>
        <p className="robot-card-title">
          היי! אני <span className="gradient-text">ValGPT</span>
        </p>
        <p className="robot-card-text">כאן כדי לעזור, לענות ולשוחח איתך בכל נושא 😊</p>
      </div>

      <button
        ref={newChatButtonRef}
        type="button"
        className="new-chat-button"
        onClick={onNewChat}
        disabled={isBusy}
      >
        <PlusIcon />
        שיחה חדשה
      </button>

      <nav className="history" aria-labelledby="history-title">
        <h2 id="history-title" className="history-title">היסטוריית שיחות</h2>

        {conversations.length === 0 ? (
          <p className="history-empty">עדיין אין שיחות שמורות.</p>
        ) : (
          <ul className="conversation-list">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    className="conversation-item"
                    onClick={() => onSelectConversation(conversation.id)}
                    aria-current={isActive ? "true" : undefined}
                    disabled={isBusy}
                  >
                    <span className="conversation-icon">
                      <ChatIcon />
                    </span>
                    <span className="conversation-title" dir="auto">
                      {conversation.title || "שיחה ללא נושא"}
                    </span>
                    <span className="conversation-time">
                      {formatSidebarDate(conversation.updated_at)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <div className="ideas-card" aria-hidden="true">
        <SparkleIcon size={26} />
        <p className="ideas-title">כאן מתחילים רעיונות גדולים</p>
        <p className="ideas-text">שאלו כל מה שמעניין אתכם</p>
        <svg className="ideas-wave" viewBox="0 0 300 60" preserveAspectRatio="none">
          <path d="M0 35 C60 10 110 55 170 32 S260 15 300 30 V60 H0z" />
        </svg>
      </div>
    </aside>
  );
}

export default Sidebar;
