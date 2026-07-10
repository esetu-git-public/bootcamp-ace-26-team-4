import os
from dotenv import load_dotenv


load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

MODEL_NAME = "gemini-2.5-flash"

TEMPERATURE = 0
TOP_P = 0.95
TOP_K = 40

MAX_OUTPUT_TOKENS = 2048
MAX_RETRIES = 3
REQUEST_TIMEOUT = 60

ENABLE_SAFETY_FILTER = True
ENABLE_LOGGING = True
LOG_PROMPTS = False
LOG_RESPONSES = False
ENABLE_STREAMING = False


if not GOOGLE_API_KEY:
    raise ValueError(
        "GOOGLE_API_KEY environment variable is not set."
    )