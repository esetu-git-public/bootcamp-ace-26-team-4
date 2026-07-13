from rag.src.routing.query_router import QueryRouter
from rag.src.retrieval.hybrid_retriever import HybridRetriever
from rag.src.retrieval.paper_grouper import PaperGrouper
from rag.src.prompt.prompt_builder import PromptBuilder
from rag.src.llm.gemini_client import GeminiClient
from rag.src.response.response_validator import ResponseValidator
from rag.src.response.citation_generator import CitationGenerator
from rag.src.evidence.evidence_aggregator import EvidenceAggregator
from rag.src.evidence.contradiction_detector import ContradictionDetector
from rag.src.evidence.claim_mapper import ClaimMapper  # NEW

# Metrics used at runtime to provide evaluation-style signals
from rag.evaluation.metrics import Metrics


class ResponseGenerator:

    def __init__(self):

        print("Initializing Response Generator...")

        self.router = QueryRouter()

        self.retriever = HybridRetriever()

        self.paper_grouper = PaperGrouper()

        self.evidence_aggregator = EvidenceAggregator()

        self.contradiction_detector = ContradictionDetector()

        self.claim_mapper = ClaimMapper()  # NEW

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

            top_k=20,

            filename=route.get("filename"),

            include_medical=route.get("needs_medical_kb", False),

            include_uploads=route.get("needs_uploaded_docs", False),

        )

        print("\n===== RETRIEVED CHUNKS =====")
        print(len(retrieved_chunks))
        print("============================\n")

        # =====================================================
        # Step 2.5 : Group Papers
        # =====================================================

        grouped_papers = self.paper_grouper.group(
            retrieved_chunks
        )

        print("\n===== GROUPED PAPERS =====")
        print(len(grouped_papers))
        print("==========================\n")

        # =====================================================
        # Step 2.6 : Detect Contradictions
        # =====================================================

        contradictions = self.contradiction_detector.detect(
            grouped_papers
        )

        # =====================================================
        # Step 2.7 : Aggregate Evidence
        # =====================================================

        evidence = self.evidence_aggregator.aggregate(
            grouped_papers
        )

        evidence["contradictions"] = contradictions

        # =====================================================
        # Step 3 : Build Prompt
        # =====================================================

        prompt = self.prompt_builder.build_prompt(

            question=question,

            evidence=evidence,

            template=template

        )

        print("\n===== PROMPT LENGTH =====")
        print(len(prompt))
        print("=========================\n")

        # =====================================================
        # Step 4 : Generate LLM Response
        # =====================================================

        answer = self.llm.generate(
            prompt
        )

        print("\n===== ANSWER LENGTH =====")
        print(len(answer))

        print("\n===== ANSWER END =====")
        print(answer[-500:])
        print("========================\n")

        # =====================================================
        # Step 4.5 : Map Claims to Evidence
        # =====================================================

        claim_mapping = self.claim_mapper.map_claims(
            answer,
            grouped_papers
        )

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
        # Additional runtime evaluation signals
        #  - Compute semantic similarity between the answer and the
        #    retrieved evidence (top N chunks).
        #  - Normalize retrieval confidence into a 0..1 range for
        #    user-friendly final scoring.
        # =====================================================

        try:
            top_evidence_text = "\n\n".join(
                c.get("text", "") for c in retrieved_chunks[:5]
            )

            evidence_semantic_similarity = Metrics.answer_semantic_similarity(
                answer,
                top_evidence_text,
            )
        except Exception:
            evidence_semantic_similarity = None

        # Normalize the retrieval confidence score to [0,1]. The validator
        # considers ~0.03 a 'High' confidence; use that as a normalization
        # reference so that values map to a more intuitive 0..1 range.
        try:
            raw_conf = float(validation.get("confidence_score", 0.0) or 0.0)
            retrieval_score_normalized = min(1.0, raw_conf / 0.03) if raw_conf >= 0 else 0.0
        except Exception:
            retrieval_score_normalized = None

        # Answer score: prefer semantic similarity to evidence when available.
        answer_score = None
        if evidence_semantic_similarity is not None:
            answer_score = evidence_semantic_similarity

        # Final score: weighted combination (60% answer, 40% retrieval)
        final_score = None
        if answer_score is not None and retrieval_score_normalized is not None:
            final_score = round(0.6 * answer_score + 0.4 * retrieval_score_normalized, 4)
        elif answer_score is not None:
            final_score = round(answer_score, 4)
        elif retrieval_score_normalized is not None:
            final_score = round(retrieval_score_normalized, 4)

        # --------------------------------------------------
        # Step 7 : Return
        # --------------------------------------------------

        return {

            "question": question,

            "answer": answer,

            "claim_mapping": claim_mapping,  # NEW

            "references": references,

            "formatted_references": formatted_references,

            "metadata": {

                "template": template,

                "route": route.get("route"),

                "intent": route.get("intent"),

                "retrieved_chunks": len(
                    retrieved_chunks
                ),

                "grouped_papers": len(
                    grouped_papers
                ),

                "references": len(
                    references
                ),

                "retrieval_confidence_score":
                    validation["confidence_score"],

                "retrieval_confidence_level":
                    validation["confidence_level"],

                # -------------------------------------------------
                # Evaluation-style signals for the user's visibility
                # -------------------------------------------------
                # semantic similarity between answer and retrieved evidence
                "evidence_semantic_similarity": (
                    round(evidence_semantic_similarity, 4)
                    if evidence_semantic_similarity is not None else None
                ),

                # answer_score: semantic match to evidence (0..1)
                "answer_score": (
                    round(answer_score, 4) if answer_score is not None else None
                ),

                # final_score: combination of answer and retrieval signals
                "final_score": final_score,

                # normalized retrieval score in 0..1 (based on validator scale)
                "retrieval_score_normalized": (
                    round(retrieval_score_normalized, 4)
                    if retrieval_score_normalized is not None else None
                )

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
