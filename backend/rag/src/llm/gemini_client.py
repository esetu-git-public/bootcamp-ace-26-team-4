import re
import time

from google import genai
from google.genai import types

from rag.src.llm.llm_config import (
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

                print("\n========== GEMINI DEBUG ==========")
                print("Finish reason:", response.candidates[0].finish_reason)

                if response.text:
                    print("Answer length:", len(response.text))
                    print("Last 500 characters:")
                    print(response.text[-500:])
                else:
                    print("No text returned.")

                print("==================================\n")

                if response.text is None:

                    raise RuntimeError(
                        "Gemini returned an empty response."
                    )

                return response.text.strip()

            except Exception as e:

                last_exception = e

                if self._is_daily_quota_exhausted(e):
                    # The free-tier daily request allowance does not recover
                    # after the RetryInfo delay.  Retrying here only wastes
                    # time, so let the evaluation checkpoint and resume later.
                    raise RuntimeError(
                        "Gemini's daily free-tier request quota is exhausted. "
                        "Try again after the quota resets."
                    ) from e

                if attempt == MAX_RETRIES - 1:
                    break

                delay = self._retry_delay_seconds(e, attempt)
                print(
                    f"[Retry {attempt+1}/{MAX_RETRIES}] {e}\n"
                    f"Waiting {delay:.0f}s before retrying..."
                )
                time.sleep(delay)

        raise RuntimeError(last_exception)

    @staticmethod
    def _retry_delay_seconds(error: Exception, attempt: int) -> float:
        """Use Gemini's suggested retry time when it is present.

        Free-tier rate-limit responses often include a `retry in Ns` hint.
        The fallback is exponential backoff, which prevents immediate retries
        from consuming the remaining request-per-minute allowance.
        """
        message = str(error)
        match = re.search(r"retry(?: in| after)?\s+([0-9.]+)s", message, re.I)
        if match:
            return min(float(match.group(1)) + 1, 120)

        return min(5 * (2 ** attempt), 60)

    @staticmethod
    def _is_daily_quota_exhausted(error: Exception) -> bool:
        """Return True only for Gemini's per-day request quota response."""
        message = str(error).lower()
        return (
            "generaterequestsperday" in message
            or "requestsperday" in message
            or "requests per day" in message
        )

    # ----------------------------------------------------------

    def health_check(self):

        try:

            response = self.generate(

                "Reply with exactly one word: READY"

            )

            return True, response

        except Exception as e:

            return False, str(e)
