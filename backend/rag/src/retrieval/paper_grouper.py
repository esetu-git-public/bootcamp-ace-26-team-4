from collections import defaultdict


class PaperGrouper:
    """
    Groups retrieved chunks into paper-level evidence.

    Responsibilities
    ----------------
    1. Group chunks by paper.
    2. Keep only the best chunks per paper.
    3. Compute a paper retrieval score.
    4. Return papers sorted by relevance.
    """

    def __init__(self, max_chunks_per_paper: int = 3):
        self.max_chunks_per_paper = max_chunks_per_paper

    # ---------------------------------------------------------

    def _get_paper_id(self, metadata: dict) -> str:
        """
        Returns the best available unique identifier.
        """

        return (
            metadata.get("pmcid")
            or metadata.get("paper_id")
            or metadata.get("doi")
            or metadata.get("source")
            or metadata.get("title")
            or "unknown"
        )

    # ---------------------------------------------------------

    def group(self, retrieved_chunks: list):

        grouped = defaultdict(list)

        # Group chunks
        for chunk in retrieved_chunks:

            metadata = chunk.get("metadata", {})

            paper_id = self._get_paper_id(metadata)

            grouped[paper_id].append(chunk)

        papers = []

        # Build paper objects
        for paper_id, chunks in grouped.items():

            # Cross-encoder relevance is the final ranking signal; RRF breaks ties.
            chunks.sort(
                key=lambda x: (x.get("rerank_score", float("-inf")), x.get("rrf_score", 0)),
                reverse=True
            )

            # Keep only the strongest evidence
            best_chunks = chunks[: self.max_chunks_per_paper]

            metadata = best_chunks[0]["metadata"]

            paper = {

                "paper_id": paper_id,

                "title": metadata.get("title", "Unknown"),

                "authors": metadata.get("authors", "Unknown"),

                "journal": metadata.get("journal", "Unknown"),

                "year": metadata.get("year", "Unknown"),

                "study_type": metadata.get(
                    "study_type",
                    "Unknown"
                ),

                "retrieval_score": max(
                    c.get("rerank_score", c.get("rrf_score", 0))
                    for c in best_chunks
                ),

                "num_chunks": len(chunks),

                "chunks": [
                    {
                        "chunk_id": c["chunk_id"],
                        "text": c["text"],
                        "rrf_score": c.get(
                            "rrf_score",
                            0
                        ),
                        "rerank_score": c.get("rerank_score"),
                    }
                    for c in best_chunks
                ],
            }

            papers.append(paper)

        # Sort papers by relevance
        papers.sort(
            key=lambda x: x["retrieval_score"],
            reverse=True,
        )

        return papers
