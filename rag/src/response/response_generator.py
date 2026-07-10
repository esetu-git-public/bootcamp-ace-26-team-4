"""
Response Generator

Complete Medical Research RAG Pipeline

Workflow:

User Question
        |
        v
Query Router
        |
        v
Hybrid Retriever
        |
        +----------------+
        |                |
        v                v
 Medical Papers      User Uploads
 Qdrant              Qdrant
        |
        v
      BM25
        |
        v
   RRF Ranking
        |
        v
 Prompt Builder
        |
        v
 Gemini Client
        |
        v
 Response Validator
        |
        v
 Citation Generator
        |
        v
 Final Response
"""


from rag.src.routing.query_router import QueryRouter
from rag.src.retrieval.hybrid_retriever import HybridRetriever
from rag.src.prompt.prompt_builder import PromptBuilder
from rag.src.llm.gemini_client import GeminiClient
from rag.src.response.response_validator import ResponseValidator
from rag.src.response.citation_generator import CitationGenerator



class ResponseGenerator:


    def __init__(self):

        print("Initializing Response Generator...")

        self.router = QueryRouter()

        self.retriever = HybridRetriever()

        self.prompt_builder = PromptBuilder()

        self.llm = GeminiClient()



    # ---------------------------------------------------------
    # Generate Answer
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
        # Step 1 : Route Query
        # =====================================================


        route = self.router.route(question)


        print("\n===== QUERY ROUTER =====")

        print(route)

        print("========================\n")



        # =====================================================
        # Step 2 : Hybrid Retrieval
        # =====================================================


        retrieved_chunks = self.retriever.retrieve(

            query=question,

            top_k=5,

            filename=route.get("filename")

        )



        print("\n===== RETRIEVED CHUNKS =====")

        print(
            len(retrieved_chunks)
        )

        print("============================\n")



        # =====================================================
        # Step 3 : Build Prompt
        # =====================================================


        prompt = self.prompt_builder.build_prompt(

            question=question,

            retrieved_chunks=retrieved_chunks,

            template=template

        )



        print("\n===== PROMPT LENGTH =====")

        print(
            len(prompt)
        )

        print("=========================\n")



        # =====================================================
        # Step 4 : Generate LLM Response
        # =====================================================


        answer = self.llm.generate(
            prompt
        )



        print("\n===== ANSWER LENGTH =====")

        print(
            len(answer)
        )

        print("\n===== ANSWER END =====")

        print(
            answer[-500:]
        )

        print("========================\n")



        # =====================================================
        # Step 5 : Citations
        # =====================================================


        references = CitationGenerator.generate(

            retrieved_chunks

        )


        formatted_references = CitationGenerator.format(

            references

        )



        # =====================================================
        # Step 6 : Validation
        # =====================================================


        validation = ResponseValidator.validate(

            answer=answer,

            references=references,

            retrieved_chunks=retrieved_chunks

        )



        # =====================================================
        # Step 7 : Return
        # =====================================================


        return {


            "question": question,


            "answer": answer,


            "references": references,


            "formatted_references": formatted_references,


            "metadata": {


                "template": template,


                "route": route.get("route"),


                "intent": route.get("intent"),


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
    # Summary
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
    # Compare Papers
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
    # Templates
    # ---------------------------------------------------------


    def available_templates(self):

        return [

            "chat",

            "summary",

            "compare"

        ]