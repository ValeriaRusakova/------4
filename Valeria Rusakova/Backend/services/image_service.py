"""
services/image_service.py
-------------------------
Creates an image with OpenAI's image model and saves it as a file on the server.

The image is saved in the folder "generated_images", and main.py shares that
folder at the address /images. So the browser can show it with:
    http://localhost:8000/images/<file name>
"""

import base64
import logging
import os
import uuid

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

logger = logging.getLogger(__name__)

OPENAI_IMAGE_MODEL = os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1-mini")

# The folder where images are saved: Backend/generated_images
IMAGES_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "generated_images")


class ImageServiceError(Exception):
    """Raised when the image could not be created."""


def create_image(prompt):
    """
    Ask OpenAI to draw an image from a text description.
    Returns the web address of the saved image, for example "/images/abc123.webp".
    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), timeout=120)

    try:
        result = client.images.generate(
            model=OPENAI_IMAGE_MODEL,
            prompt=prompt,
            size="1024x1024",
            quality="low",          # "low" is fast and cheap - good enough for a chat
            output_format="webp",   # webp files are much smaller than png
        )
    except Exception as error:
        logger.error("Image generation failed: %s", type(error).__name__)
        raise ImageServiceError("Could not create the image") from error

    # The image arrives as text (base64). We turn it back into bytes and save it.
    image_bytes = base64.b64decode(result.data[0].b64_json)

    os.makedirs(IMAGES_FOLDER, exist_ok=True)
    file_name = f"{uuid.uuid4().hex}.webp"  # random unique name
    with open(os.path.join(IMAGES_FOLDER, file_name), "wb") as image_file:
        image_file.write(image_bytes)

    return f"/images/{file_name}"


def delete_image(image_url):
    """Delete the file of an image, for example "/images/abc123.webp" (used when a conversation is deleted)."""
    # basename() keeps only the file name, so nobody can reach files outside the images folder
    file_name = os.path.basename(image_url)
    file_path = os.path.join(IMAGES_FOLDER, file_name)

    if os.path.isfile(file_path):
        os.remove(file_path)
