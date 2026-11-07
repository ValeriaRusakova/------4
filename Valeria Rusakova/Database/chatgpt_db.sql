-- =====================================================================
-- chatgpt_db.sql
-- Database structure for the "ValGPT" chat project.
-- Running this file creates the database and its two tables.
-- =====================================================================

-- utf8mb4 lets us store Hebrew, English and emojis correctly.
CREATE DATABASE IF NOT EXISTS chatgpt_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE chatgpt_db;

-- ---------------------------------------------------------------------
-- Table: conversations
-- One row = one chat conversation.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
    id          INT AUTO_INCREMENT PRIMARY KEY,               -- unique conversation id
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP   -- when the conversation started
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: messages
-- One row = one message inside a conversation.
-- role tells us who wrote it: 'user' (the person) or 'assistant' (the AI).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id               INT AUTO_INCREMENT PRIMARY KEY,        -- unique message id (also keeps the order)
    conversation_id  INT NOT NULL,                          -- which conversation this message belongs to
    role             ENUM('user', 'assistant') NOT NULL,    -- who sent the message
    content          TEXT NOT NULL,                         -- the message text
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key: every message must point to an existing conversation.
    -- ON DELETE CASCADE: if a conversation is deleted, its messages are deleted too.
    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
        ON DELETE CASCADE,

    -- Index: makes "get all messages of conversation X in order" fast.
    INDEX idx_messages_conversation (conversation_id, id)
) ENGINE=InnoDB;
