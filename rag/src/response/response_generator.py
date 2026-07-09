"""
Response Generator

This module orchestrates the complete Medical Research
RAG Pipeline.

Workflow

User Question
        │
        ▼
Hybrid Retriever
        │
        ▼
Prompt Builder
        │
        ▼
Gemini Client
        │
        ▼
Response Validator
        │
        ▼
Citation Generator
        │
        ▼
Final Response
"""
from rag.src.retrieval.hybrid_retriever import HybridRetriever
from rag.src.prompt.prompt_builder import PromptBuilder
from rag.src.llm.gemini_client import GeminiClient
from rag.src.response.response_validator import ResponseValidator
from rag.src.response.citation_generator import CitationGenerator


class ResponseGenerator:

    def __init__(self):

        self.retriever = HybridRetriever()

        self.prompt_builder = PromptBuilder()

        self.llm = GeminiClient()

    # ---------------------------------------------------------

    def generate_answer(
        self,
        question: str,
        template: str = "chat"
    ):

        if not isinstance(question, str):

            raise TypeError(
                "Question must be a string."
            )

        if not question.strip():

            raise ValueError(
                "Question cannot be empty."
            )

        # =====================================================
        # Step 1 : Retrieve Relevant Documents
        # =====================================================

        retrieved_chunks = self.retriever.retrieve(

            query=question,
            top_k= 3

        )

        # =====================================================
        # Step 2 : Build Prompt
        # =====================================================

        prompt = self.prompt_builder.build_prompt(

            question=question,

            retrieved_chunks=retrieved_chunks,

            template=template

        )

        # =====================================================
        # Step 3 : Generate LLM Response
        # =====================================================

        print("\n===== PROMPT LENGTH =====")
        print(len(prompt))
        print("=========================\n")

        answer = self.llm.generate(prompt)

        print("\n===== ANSWER LENGTH =====")
        print(len(answer))
        print("\n===== ANSWER END =====")
        print(answer[-500:])
        print("=========================\n")

        # =====================================================
        # Step 4 : Generate Citations
        # =====================================================

        references = CitationGenerator.generate(

            retrieved_chunks

        )

        formatted_references = CitationGenerator.format(

            references

        )

        # =====================================================
        # Step 5 : Validate Response
        # =====================================================

        validation = ResponseValidator.validate(

            answer=answer,

            references=references,

            retrieved_chunks=retrieved_chunks

        )

        # =====================================================
        # Step 6 : Return Final Response
        # =====================================================

        return {

            "question": question,

            "answer": answer,

            "references": references,

            "formatted_references": formatted_references,

            "metadata": {

                "template": template,

                "retrieved_chunks": len(
                    retrieved_chunks
                ),

                "references": len(
                    references
                ),

                "retrieval_confidence_score":
                    validation["confidence_score"],

                "retrieval_confidence_level":
                    validation["confidence_level"]

            }

        }

    # ---------------------------------------------------------

    def generate_summary(
        self,
        question: str
    ):

        return self.generate_answer(

            question=question,

            template="summary"

        )

    # ---------------------------------------------------------

    def compare_papers(
        self,
        question: str
    ):

        return self.generate_answer(

            question=question,

            template="compare"

        )

    # ---------------------------------------------------------

    def available_templates(self):

        return [

            "chat",

            "summary",

            "compare"

        ]