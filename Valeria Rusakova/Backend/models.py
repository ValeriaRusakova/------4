"""
models.py
---------
Describes the MySQL tables as Python classes (SQLAlchemy "models").
Each class = one table, each attribute = one column.
The tables must match Database/chatgpt_db.sql.
"""

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from database import Base


class Conversation(Base):
    """One chat conversation."""

    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=True)  # topic shown in the sidebar
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), index=True)

    # All messages of this conversation, always sorted from oldest to newest.
    # passive_deletes=True: when a conversation is deleted, MySQL deletes its messages
    # by itself (ON DELETE CASCADE in the database).
    messages = relationship(
        "Message",
        back_populates="conversation",
        order_by="Message.id",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Message(Base):
    """One message inside a conversation, written by the user or by the assistant."""

    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(
        Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role = Column(Enum("user", "assistant"), nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=True)  # only for AI-generated images
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
