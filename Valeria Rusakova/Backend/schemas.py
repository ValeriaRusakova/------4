"""
schemas.py
----------
Pydantic "schemas" = the shape of the JSON that goes in and out of the API.
FastAPI uses them to:
1. Validate incoming data (for example: a message cannot be empty).
2. Build the JSON responses.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class MessageCreate(BaseModel):
    """What the client sends when the user writes a new message."""

    # min_length=1 + strip whitespace -> an empty or spaces-only message is rejected (HTTP 422)
    content: str = Field(min_length=1, max_length=4000)

    model_config = ConfigDict(str_strip_whitespace=True)


class MessageOut(BaseModel):
    """One message as returned to the client."""

    id: int
    conversation_id: int
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime

    # Allows building this schema directly from a SQLAlchemy Message object
    model_config = ConfigDict(from_attributes=True)


class ConversationOut(BaseModel):
    """A conversation as returned to the client."""

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatReply(BaseModel):
    """Response after sending a message: the saved user message + the AI answer."""

    user_message: MessageOut
    assistant_message: MessageOut
