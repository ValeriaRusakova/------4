// Sidebar.jsx - the side menu: robot card, "new chat" button and the
// history of conversations (by topic). Clicking a conversation opens it again,
// and the trash button next to it deletes it.
import { useEffect, useRef, useState } from "react";
import RobotAvatar from "./RobotAvatar.jsx";
import { ChatIcon, CloseIcon, PlusIcon, SparkleIcon, TrashIcon } from "./Icons.jsx";
import { formatSidebarDate } from "../utils/formatTime.js";

function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
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

  // Text for screen readers after a deletion ("the conversation was deleted")
  const [announcement, setAnnouncement] = useState("");

  async function handleDelete(conversation) {
    const title = conversation.title || "שיחה ללא נושא";
    // A simple built-in "are you sure?" window, so nothing is deleted by mistake
    const isSure = window.confirm(`למחוק את השיחה "${title}"? לא ניתן לשחזר אותה.`);
    if (!isSure) {
      return;
    }

    const wasDeleted = await onDeleteConversation(conversation.id);
    if (wasDeleted) {
      setAnnouncement(`השיחה "${title}" נמחקה`);
      // The deleted button is gone, so move the keyboard focus to a safe place
      newChatButtonRef.current.focus();
    }
  }

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
              const title = conversation.title || "שיחה ללא נושא";
              return (
                <li key={conversation.id} className="conversation-row">
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
                      {title}
                    </span>
                    <span className="conversation-time">
                      {formatSidebarDate(conversation.updated_at)}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(conversation)}
                    aria-label={`מחיקת השיחה: ${title}`}
                    title="מחיקת השיחה"
                    disabled={isBusy}
                  >
                    <TrashIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Screen readers read this text out loud when it changes */}
        <p className="visually-hidden" role="status">
          {announcement}
        </p>
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
