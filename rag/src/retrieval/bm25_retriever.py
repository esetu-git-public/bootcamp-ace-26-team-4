from pathlib import Path
import json

from rank_bm25 import BM25Okapi



BASE_DIR = Path(__file__).resolve().parents[2]

CHUNKS_PATH = BASE_DIR / "data" / "chunks" / "chunks.jsonl"

TOP_K = 5


class BM25Retriever:
    """
    BM25 Retriever using rank-bm25.
    """

    def __init__(self):

        self.documents = []
        self.corpus = []

        self.load_chunks()

        self.bm25 = BM25Okapi(self.corpus)


    def load_chunks(self):

        if not CHUNKS_PATH.exists():
            raise FileNotFoundError(
                f"Chunks file not found: {CHUNKS_PATH}"
            )

        with open(CHUNKS_PATH, "r", encoding="utf-8") as f:

            for line in f:

                if not line.strip():
                    continue

                chunk = json.loads(line)

                self.documents.append(chunk)

                tokens = chunk["text"].lower().split()

                self.corpus.append(tokens)

    def retrieve(self, query, top_k=TOP_K):

        query_tokens = query.lower().split()

        scores = self.bm25.get_scores(query_tokens)

        ranked = sorted(
            zip(scores, self.documents),
            key=lambda x: x[0],
            reverse=True
        )

        results = []

        for score, chunk in ranked[:top_k]:

            results.append({

                "chunk_id": chunk["chunk_id"],

                "text": chunk["text"],

                "metadata": {

                    "pmc_id": chunk.get("pmc_id", ""),

                    "title": chunk.get("title", ""),

                    "journal": chunk.get("journal", ""),

                    "publication_year": chunk.get(
                        "publication_year",
                        ""
                    ),

                    "chunk_index": chunk.get(
                        "chunk_index",
                        ""
                    ),

                    "source_file": chunk.get(
                        "source_file",
                        ""
                    )

                },

                "score": float(score)

            })

        return results