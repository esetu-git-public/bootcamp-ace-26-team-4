print("Loading llm_config.py")

import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

print("API Key Loaded:", GOOGLE_API_KEY is not None)

MODEL_NAME = "gemini-2.5-flash"

# Other options:
# "gemini-2.5-pro"
# "gemini-2.5-flash"

TEMPERATURE = 0

TOP_P = 0.95

TOP_K = 40

MAX_OUTPUT_TOKENS = 2048

ENABLE_SAFETY_FILTER = True

REQUEST_TIMEOUT = 60

MAX_RETRIES = 3

ENABLE_LOGGING = True

LOG_PROMPTS = False

LOG_RESPONSES = False


ENABLE_STREAMING = False

if not GOOGLE_API_KEY:
    raise ValueError(
        "GOOGLE_API_KEY not found. "
        "Create a .env file and add your API key."
    )