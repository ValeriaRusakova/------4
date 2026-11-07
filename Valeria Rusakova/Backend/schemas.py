"""
schemas.py
----------
Pydantic "schemas" = the shape of the JSON that goes in and out of the API.
FastAPI uses them to:
1. Validate incoming data (for example: a message cannot be empty).
2. Build the JSON responses.
"""

from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_serializer


def to_utc_text(value):
    """
    MySQL gives us times without a time zone, but we know they are UTC.
    Adding "+00:00" tells the browser it is UTC, so it can show the user's local time.
    """
    return value.replace(tzinfo=timezone.utc).isoformat()


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
    image_url: Optional[str] = None  # set only when the AI created an image
    created_at: datetime

    # Allows building this schema directly from a SQLAlchemy Message object
    model_config = ConfigDict(from_attributes=True)

    @field_serializer("created_at")
    def serialize_time(self, value):
        return to_utc_text(value)


class ConversationOut(BaseModel):
    """A conversation as returned to the client (also used for the sidebar list)."""

    id: int
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_serializer("created_at", "updated_at")
    def serialize_time(self, value):
        return to_utc_text(value)


class ChatReply(BaseModel):
    """Response after sending a message: the saved user message + the AI answer."""

    user_message: MessageOut
    assistant_message: MessageOut
    conversation: ConversationOut  # includes the (maybe new) topic title for the sidebar
