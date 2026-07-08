from rag.src.prompt.templates import (
    CHAT_TEMPLATE,
    SUMMARY_TEMPLATE,
    COMPARE_TEMPLATE
)

from rag.src.prompt.metadata_formatter import MetadataFormatter


class PromptBuilder:
    """
    Builds prompts for the Medical Research AI Assistant.

    Supported templates:
        - chat
        - summary
        - compare
    """

    def __init__(self):

        self.templates = {
            "chat": CHAT_TEMPLATE,
            "summary": SUMMARY_TEMPLATE,
            "compare": COMPARE_TEMPLATE
        }

    # ----------------------------------------------------------

    def _validate_template(self, template: str):

        if template not in self.templates:

            raise ValueError(
                f"Unsupported template '{template}'. "
                f"Available templates: {list(self.templates.keys())}"
            )

    # ----------------------------------------------------------

    def _build_context(self, retrieved_chunks):

        formatted_chunks = []

        for index, chunk in enumerate(retrieved_chunks, start=1):

            formatted_chunks.append(

                MetadataFormatter.format_chunk(
                    chunk,
                    index
                )

            )

        return "\n".join(formatted_chunks)

    # ----------------------------------------------------------

    def build_prompt(
        self,
        question: str,
        retrieved_chunks: list,
        template: str = "chat"
    ) -> str:

        self._validate_template(template)

        context = self._build_context(
            retrieved_chunks
        )

        prompt = self.templates[template].format(

            context=context,

            question=question

        )

        return prompt

    # ----------------------------------------------------------

    def build_chat_prompt(
        self,
        question,
        retrieved_chunks
    ):

        return self.build_prompt(

            question,

            retrieved_chunks,

            template="chat"

        )

    # ----------------------------------------------------------

    def build_summary_prompt(
        self,
        retrieved_chunks
    ):

        return self.build_prompt(

            "",

            retrieved_chunks,

            template="summary"

        )

    # ----------------------------------------------------------

    def build_compare_prompt(
        self,
        retrieved_chunks
    ):

        return self.build_prompt(

            "",

            retrieved_chunks,

            template="compare"

        )

    # ----------------------------------------------------------

    def available_templates(self):

        return list(self.templates.keys())