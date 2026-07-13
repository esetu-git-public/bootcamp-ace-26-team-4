import os
from dotenv import load_dotenv


load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

MODEL_NAME = "gemini-2.5-flash"

TEMPERATURE = 0
TOP_P = 0.95
TOP_K = 40

# The answer format has several evidence sections.  2048 tokens frequently
# truncates an otherwise valid response before its conclusion.
MAX_OUTPUT_TOKENS = 4096
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
