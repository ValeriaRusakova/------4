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

Tools: we also give the model two "tools":
1. web_search (built into OpenAI) - lets the model search the internet for up-to-date
   information, like the weather, news or prices. The answer includes links to the sources.
2. generate_image (our own tool) - when the user asks for a picture, the model calls it,
   we run it, and then the model writes a short answer about the image.
The model decides by itself when to use each tool.
"""

import logging
import os
from datetime import date

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

from services.image_service import ImageServiceError, create_image

load_dotenv()

logger = logging.getLogger(__name__)

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# OpenAI's built-in internet search tool.
# user_location helps with local questions ("weather tomorrow") - the site is for users in Israel.
WEB_SEARCH_TOOL = {
    "type": "web_search_preview",
    "user_location": {"type": "approximate", "country": "IL", "timezone": "Asia/Jerusalem"},
}


def get_system_prompt():
    """
    The "personality" instructions that are sent first in every conversation.
    It includes today's date, so the model understands words like "tomorrow".
    """
    return (
        "You are ValGPT, a friendly and helpful assistant. "
        f"Today's date is {date.today().isoformat()}. "
        "Answer in the same language the user writes in (Hebrew or English). "
        "Keep answers clear and concise. "
        "When the user asks about current or up-to-date information (weather, news, prices, events), "
        "use web search and mention the sources. "
        "When the user asks you to draw, create or generate a picture, use the generate_image tool. "
        "After the image is ready, describe it in one short sentence."
    )


class ChatServiceError(Exception):
    """Raised when we could not get an answer from OpenAI."""


@tool
def generate_image(prompt: str) -> str:
    """Create an image from a detailed English description of what to draw."""
    # The docstring above is sent to the model - it explains when and how to use the tool.
    return create_image(prompt)


def create_llm():
    """Create the LangChain connection to the OpenAI chat model."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY is missing in the .env file")
        raise ChatServiceError("OpenAI is not configured")

    # timeout: don't wait forever; max_retries: try again on short network problems.
    # use_responses_api=True: OpenAI's newer API, needed for the built-in web search tool.
    return ChatOpenAI(
        model=OPENAI_MODEL,
        api_key=api_key,
        timeout=60,
        max_retries=2,
        use_responses_api=True,
    )


def build_langchain_messages(history, new_user_text):
    """
    Turn our database messages into LangChain message objects.

    history       -> list of Message rows from MySQL (already sorted oldest -> newest)
    new_user_text -> the message the user just wrote
    """
    langchain_messages = [SystemMessage(content=get_system_prompt())]

    for message in history:
        if message.role == "user":
            langchain_messages.append(HumanMessage(content=message.content))
        else:
            langchain_messages.append(AIMessage(content=message.content))

    langchain_messages.append(HumanMessage(content=new_user_text))
    return langchain_messages


def get_ai_reply(history, new_user_text):
    """
    Send the full conversation to OpenAI.
    Returns two values: (answer_text, image_url).
    image_url is None when no image was created.
    """
    llm = create_llm()
    # Tell the model which tools exist (it decides by itself when to use them)
    llm_with_tools = llm.bind_tools([WEB_SEARCH_TOOL, generate_image])
    messages = build_langchain_messages(history, new_user_text)
    image_url = None

    try:
        response = llm_with_tools.invoke(messages)

        # Did the model decide to use the image tool?
        # (Web search does not appear here - OpenAI runs it by itself and puts the result in the answer.)
        if response.tool_calls:
            messages.append(response)

            for tool_call in response.tool_calls:
                try:
                    image_url = generate_image.invoke(tool_call["args"])
                    tool_result = "The image was created and is shown to the user."
                except ImageServiceError:
                    tool_result = "Image creation failed. Tell the user to try again later."
                # Tell the model what happened with the tool
                messages.append(ToolMessage(content=tool_result, tool_call_id=tool_call["id"]))

            # Ask the model again, now it writes the final answer for the user
            response = llm_with_tools.invoke(messages)

    except Exception as error:
        # Write the real error to the server log only - never send it to the browser,
        # because error texts can contain technical details we don't want to expose.
        logger.error("OpenAI request failed: %s", type(error).__name__)
        raise ChatServiceError("Could not get an answer from OpenAI") from error

    # The answer can arrive in several parts (text + source links), .text() joins the text together.
    return response.text(), image_url


def create_title(first_user_text, first_answer):
    """
    Ask the model for a short topic (2-4 words) for the sidebar.
    If it fails, we simply use the beginning of the user's message.
    """
    fallback_title = first_user_text[:40]

    try:
        llm = create_llm()
        response = llm.invoke([
            SystemMessage(content=(
                "Write a short topic title (2-4 words) for this conversation, "
                "in the same language as the user. Return only the title, without quotes."
            )),
            HumanMessage(content=f"User: {first_user_text}\nAssistant: {first_answer[:500]}"),
        ])
        title = response.text().strip().strip('"').strip("'")
    except Exception as error:
        logger.error("Title generation failed: %s", type(error).__name__)
        return fallback_title

    if title == "":
        return fallback_title
    return title[:100]  # the database column holds up to 100 characters
