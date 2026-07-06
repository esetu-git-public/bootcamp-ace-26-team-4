from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parents[2]

CHROMA_DIR = BASE_DIR / "data" / "vector_store" / "chroma_db"

COLLECTION_NAME = "medical_research_papers"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

TOP_K = 5


class DenseRetriever:

    def __init__(self):
        print("Loading embedding model...")

        self.model = SentenceTransformer(MODEL_NAME)

        print("Connecting to ChromaDB...")

        self.client = chromadb.PersistentClient(
            path=str(CHROMA_DIR)
        )

        self.collection = self.client.get_collection(
            COLLECTION_NAME
        )

    def retrieve(self, query, top_k=TOP_K):

        # Convert user question into embedding
        query_embedding = self.model.encode(
            query,
            normalize_embeddings=True
        ).tolist()

        # Search ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        retrieved_chunks = []

        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        ids = results["ids"][0]

        # Distances may not always exist depending on configuration
        distances = results.get("distances")

        if distances is not None:
            distances = distances[0]

        for i in range(len(documents)):

            retrieved_chunks.append({

                "chunk_id": ids[i],

                "text": documents[i],

                "metadata": metadatas[i],

                "score": None if distances is None else distances[i]

            })

        return retrieved_chunks
