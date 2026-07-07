"""
Gemini Client

Uses the new google-genai SDK.
"""

import time

from google import genai
from google.genai import types

from llm.llm_config import (
    GOOGLE_API_KEY,
    MODEL_NAME,
    TEMPERATURE,
    TOP_P,
    MAX_OUTPUT_TOKENS,
    MAX_RETRIES,
)


class GeminiClient:

    def __init__(self):

        self.client = genai.Client(
            api_key=GOOGLE_API_KEY
        )

    # ----------------------------------------------------------

    def generate(self, prompt: str) -> str:

        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        last_exception = None

        for attempt in range(MAX_RETRIES):

            try:

                response = self.client.models.generate_content(

                    model=MODEL_NAME,

                    contents=prompt,

                    config=types.GenerateContentConfig(

                        temperature=TEMPERATURE,

                        top_p=TOP_P,

                        max_output_tokens=MAX_OUTPUT_TOKENS

                    )

                )

                if response.text is None:

                    raise RuntimeError(
                        "Gemini returned an empty response."
                    )

                return response.text.strip()

            except Exception as e:

                last_exception = e

                print(
                    f"[Retry {attempt+1}/{MAX_RETRIES}] {e}"
                )

                time.sleep(2)

        raise RuntimeError(last_exception)

    # ----------------------------------------------------------

    def health_check(self):

        try:

            response = self.generate(

                "Reply with exactly one word: READY"

            )

            return True, response

        except Exception as e:

            return False, str(e)