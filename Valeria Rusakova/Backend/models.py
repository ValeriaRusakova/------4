"""
models.py
---------
Describes the MySQL tables as Python classes (SQLAlchemy "models").
Each class = one table, each attribute = one column.
The tables must match Database/chatgpt_db.sql.
"""

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Text, func
from sqlalchemy.orm import relationship

from database import Base


class Conversation(Base):
    """One chat conversation."""

    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    # All messages of this conversation, always sorted from oldest to newest.
    messages = relationship("Message", back_populates="conversation", order_by="Message.id")


class Message(Base):
    """One message inside a conversation, written by the user or by the assistant."""

    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(
        Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role = Column(Enum("user", "assistant"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
