from typing import List, Optional


class Metrics:

    @staticmethod
    def precision_at_k(retrieved, relevant):

        retrieved_ids = {
            c["chunk_id"] for c in retrieved
        }

        relevant_ids = set(relevant)

        if not retrieved_ids:
            return 0

        return len(
            retrieved_ids & relevant_ids
        ) / len(retrieved_ids)

    @staticmethod
    def recall_at_k(retrieved, relevant):

        retrieved_ids = {
            c["chunk_id"] for c in retrieved
        }

        relevant_ids = set(relevant)

        if not relevant_ids:
            return 0

        return len(
            retrieved_ids & relevant_ids
        ) / len(relevant_ids)

    @staticmethod
    def retrieval_f1(precision: float, recall: float) -> float:
        """Return F1 score combining precision and recall. Handles edge cases.

        If both precision and recall are zero, return 0. Otherwise compute
        standard F1: 2 * (P * R) / (P + R).
        """
        if precision <= 0 and recall <= 0:
            return 0.0
        if precision + recall == 0:
            return 0.0
        return 2 * (precision * recall) / (precision + recall)

    @staticmethod
    def answer_semantic_similarity(answer: str, reference: str, model=None) -> Optional[float]:
        """Compute a semantic similarity score between the model's answer and
        the reference answer using sentence-transformers cosine similarity.

        Returns a float in [0, 1] where 1 is identical. Returns None if the
        required library is not available or input is empty.
        """
        try:
            if not answer or not reference:
                return None

            # Lazy import so the library is optional for basic evaluation runs
            from sentence_transformers import util
            from rag.src.llm.embedding_model import get_embedding_model

            # Use a small, fast model suited for semantic similarity. It will be
            # downloaded automatically the first time it runs.
            model = model or get_embedding_model()

            emb1 = model.encode(answer, convert_to_tensor=True)
            emb2 = model.encode(reference, convert_to_tensor=True)

            score = util.pytorch_cos_sim(emb1, emb2).item()

            # Cosine similarity may be in [-1, 1]. Normalize to [0, 1].
            normalized = max(0.0, (score + 1.0) / 2.0)
            return float(normalized)

        except Exception:
            # If the environment can't load sentence-transformers, fall back to None.
            return None
