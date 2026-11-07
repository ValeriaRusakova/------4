"""
services/chat_service.py
------------------------
The "brain" of the chat: sends the conversation to OpenAI through LangChain
and returns the AI answer.

Why LangChain? It gives us a simple, standard way to describe a conversation
(SystemMessage / HumanMessage / AIMessage) and send it to the model with ChatOpenAI.

How context works (no complicated memory needed):
we take ALL previous messages of the SAME conversation from MySQL (oldest first),
add the new user message at the end, and send the whole list to the model.
That is how the model "remembers" what was said before.
"""

import logging
import os

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

load_dotenv()

logger = logging.getLogger(__name__)

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# The "personality" instructions that are sent first in every conversation.
SYSTEM_PROMPT = (
    "You are ValGPT, a friendly and helpful assistant. "
    "Answer in the same language the user writes in (Hebrew or English). "
    "Keep answers clear and concise."
)


class ChatServiceError(Exception):
    """Raised when we could not get an answer from OpenAI."""


def build_langchain_messages(history, new_user_text):
    """
    Turn our database messages into LangChain message objects.

    history       -> list of Message rows from MySQL (already sorted oldest -> newest)
    new_user_text -> the message the user just wrote
    """
    langchain_messages = [SystemMessage(content=SYSTEM_PROMPT)]

    for message in history:
        if message.role == "user":
            langchain_messages.append(HumanMessage(content=message.content))
        else:
            langchain_messages.append(AIMessage(content=message.content))

    langchain_messages.append(HumanMessage(content=new_user_text))
    return langchain_messages


def get_ai_reply(history, new_user_text):
    """Send the full conversation to OpenAI and return the answer text."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY is missing in the .env file")
        raise ChatServiceError("OpenAI is not configured")

    # ChatOpenAI = LangChain's connector to OpenAI chat models.
    # timeout: don't wait forever; max_retries: try again on short network problems.
    llm = ChatOpenAI(model=OPENAI_MODEL, api_key=api_key, timeout=60, max_retries=2)

    messages = build_langchain_messages(history, new_user_text)

    try:
        response = llm.invoke(messages)
    except Exception as error:
        # Write the real error to the server log only - never send it to the browser,
        # because error texts can contain technical details we don't want to expose.
        logger.error("OpenAI request failed: %s", type(error).__name__)
        raise ChatServiceError("Could not get an answer from OpenAI") from error

    return response.content
