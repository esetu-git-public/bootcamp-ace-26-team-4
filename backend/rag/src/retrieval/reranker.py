from sentence_transformers import CrossEncoder
from rag.src.llm.reranker_model import get_reranker_model


class Reranker:

    def __init__(self):

        self.model = get_reranker_model()

    def rerank(self, query, chunks):

        if not chunks:
            return []

        pairs = [
            (query, chunk["text"])
            for chunk in chunks
        ]

        scores = self.model.predict(pairs)

        for chunk, score in zip(chunks, scores):
            chunk["rerank_score"] = float(score)

        return sorted(
            chunks,
            key=lambda x: x["rerank_score"],
            reverse=True
        )
