"""
routes/conversations.py
-----------------------
The API endpoints (URLs) for conversations and messages.

  POST /api/conversations                      -> start a new conversation
  GET  /api/conversations/{id}/messages        -> get all messages of a conversation
  POST /api/conversations/{id}/messages        -> send a message and get the AI answer
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Conversation, Message
from schemas import ChatReply, ConversationOut, MessageCreate, MessageOut
from services.chat_service import ChatServiceError, get_ai_reply

router = APIRouter(prefix="/api/conversations", tags=["Conversations"])


def find_conversation_or_404(conversation_id, db):
    """Return the conversation, or stop the request with 404 if it does not exist."""
    conversation = db.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="השיחה לא נמצאה")
    return conversation


@router.post("", response_model=ConversationOut, status_code=status.HTTP_201_CREATED)
def create_conversation(db: Session = Depends(get_db)):
    """Create a new, empty conversation and return its id."""
    conversation = Conversation()
    db.add(conversation)
    db.commit()
    db.refresh(conversation)  # load the id and created_at that MySQL generated
    return conversation


@router.get("/{conversation_id}/messages", response_model=list[MessageOut])
def get_messages(conversation_id: int, db: Session = Depends(get_db)):
    """Return all messages of one conversation, oldest first."""
    conversation = find_conversation_or_404(conversation_id, db)
    return conversation.messages


@router.post(
    "/{conversation_id}/messages",
    response_model=ChatReply,
    status_code=status.HTTP_201_CREATED,
)
def send_message(conversation_id: int, body: MessageCreate, db: Session = Depends(get_db)):
    """
    The main chat flow:
    1. Make sure the conversation exists.
    2. Load its previous messages from MySQL (only THIS conversation, in order).
    3. Send history + new message to OpenAI (through LangChain).
    4. Save the user message and the AI answer in MySQL.
    5. Return both messages to the client.
    """
    conversation = find_conversation_or_404(conversation_id, db)
    history = conversation.messages

    try:
        answer_text = get_ai_reply(history, body.content)
    except ChatServiceError:
        # We save nothing if OpenAI failed, so the conversation stays consistent
        # and the user can simply try again.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="שירות ה-AI אינו זמין כרגע. נסו שוב בעוד רגע.",
        )

    user_message = Message(conversation_id=conversation.id, role="user", content=body.content)
    assistant_message = Message(conversation_id=conversation.id, role="assistant", content=answer_text)

    # Saved in this order, so the user message always gets the smaller id.
    db.add(user_message)
    db.flush()
    db.add(assistant_message)
    db.commit()
    db.refresh(user_message)
    db.refresh(assistant_message)

    return ChatReply(user_message=user_message, assistant_message=assistant_message)
