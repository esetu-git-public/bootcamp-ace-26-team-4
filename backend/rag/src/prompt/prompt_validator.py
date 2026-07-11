from typing import List


class PromptValidator:
    """
    Validates prompts before sending them to the LLM.
    """

    MAX_PROMPT_CHARS = 20000
    MAX_CONTEXT_CHARS = 15000
    MIN_QUESTION_LENGTH = 3

    @staticmethod
    def validate_question(question: str):

        if not isinstance(question, str):
            raise TypeError("Question must be a string.")

        if not question.strip():
            raise ValueError("Question cannot be empty.")

        if len(question.strip()) < PromptValidator.MIN_QUESTION_LENGTH:
            raise ValueError("Question is too short.")

    @staticmethod
    def validate_chunks(retrieved_chunks: List):

        if retrieved_chunks is None:
            raise ValueError("Retrieved chunks cannot be None.")

        if not isinstance(retrieved_chunks, list):
            raise TypeError("Retrieved chunks must be a list.")

        if len(retrieved_chunks) == 0:
            raise ValueError("No retrieved chunks found.")

    @staticmethod
    def validate_context(context: str):

        if not isinstance(context, str):
            raise TypeError("Context must be a string.")

        if not context.strip():
            raise ValueError("Context is empty.")

        if len(context) > PromptValidator.MAX_CONTEXT_CHARS:
            raise ValueError(
                f"Context exceeds {PromptValidator.MAX_CONTEXT_CHARS} characters."
            )

    @staticmethod
    def validate_template(template: str, available_templates):

        if template not in available_templates:
            raise ValueError(
                f"Unknown template '{template}'. "
                f"Available templates: {available_templates}"
            )

    @staticmethod
    def validate_prompt(prompt: str):

        if not isinstance(prompt, str):
            raise TypeError("Prompt must be a string.")

        if not prompt.strip():
            raise ValueError("Prompt is empty.")

        if len(prompt) > PromptValidator.MAX_PROMPT_CHARS:
            raise ValueError(
                f"Prompt exceeds {PromptValidator.MAX_PROMPT_CHARS} characters."
            )

    @classmethod
    def validate(
        cls,
        question: str,
        retrieved_chunks: List,
        context: str,
        prompt: str,
        template: str,
        available_templates
    ):

        cls.validate_question(question)

        cls.validate_chunks(retrieved_chunks)

        cls.validate_context(context)

        cls.validate_template(
            template,
            available_templates
        )

        cls.validate_prompt(prompt)

        return True