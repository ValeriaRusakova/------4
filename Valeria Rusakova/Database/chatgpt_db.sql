-- =====================================================================
-- chatgpt_db.sql
-- Database structure for the "ValGPT" chat project.
-- Running this file creates the database and its two tables.
-- All times are saved in UTC (the server sets this for every connection).
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
    title       VARCHAR(100) NULL,                            -- short topic, made by the AI after the first message
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- when the conversation started
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- time of the last message (for sorting the sidebar)

    -- Index: makes "newest conversations first" fast.
    INDEX idx_conversations_updated (updated_at)
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
    image_url        VARCHAR(255) NULL,                     -- address of an AI-generated image (most messages: NULL)
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key: every message must point to an existing conversation.
    -- ON DELETE CASCADE: if a conversation is deleted, its messages are deleted too.
    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
        ON DELETE CASCADE,

    -- Index: makes "get all messages of conversation X in order" fast.
    INDEX idx_messages_conversation (conversation_id, id)
) ENGINE=InnoDB;
