from retrieval.dense_retriever import DenseRetriever
from retrieval.bm25_retriever import BM25Retriever


class HybridRetriever:
    """
    Hybrid Retriever using Reciprocal Rank Fusion (RRF).

    Combines:
        - Dense Retrieval (ChromaDB)
        - BM25 Retrieval

    Returns a unified ranked list of chunks.
    """

    def __init__(self):

        self.dense = DenseRetriever()

        self.bm25 = BM25Retriever()


    def _rrf_score(self, rank, k=60):
        """
        Reciprocal Rank Fusion score.

        score = 1 / (k + rank)

        k=60 is commonly used.
        """

        return 1.0 / (k + rank)

    def retrieve(self, query, top_k=5):

        dense_results = self.dense.retrieve(
            query,
            top_k=top_k * 2
        )

        bm25_results = self.bm25.retrieve(
            query,
            top_k=top_k * 2
        )

        fused = {}


        for rank, result in enumerate(dense_results, start=1):

            chunk_id = result["chunk_id"]

            fused[chunk_id] = {

                "chunk_id": chunk_id,

                "text": result["text"],

                "metadata": result["metadata"],

                "rrf_score": self._rrf_score(rank),

                "dense_score": result["score"],

                "bm25_score": None,

                "retrieval_sources": ["dense"]

            }

        for rank, result in enumerate(bm25_results, start=1):

            chunk_id = result["chunk_id"]

            if chunk_id in fused:

                fused[chunk_id]["rrf_score"] += self._rrf_score(rank)

                fused[chunk_id]["bm25_score"] = result["score"]

                fused[chunk_id]["retrieval_sources"].append("bm25")

            else:

                fused[chunk_id] = {

                    "chunk_id": chunk_id,

                    "text": result["text"],

                    "metadata": result["metadata"],

                    "rrf_score": self._rrf_score(rank),

                    "dense_score": None,

                    "bm25_score": result["score"],

                    "retrieval_sources": ["bm25"]

                }



        ranked_results = sorted(

            fused.values(),

            key=lambda x: x["rrf_score"],

            reverse=True

        )

        return ranked_results[:top_k]