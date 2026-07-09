from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parents[2]

CHROMA_DIR = BASE_DIR / "data" / "vector_store" / "chroma_db"

MAIN_COLLECTION_NAME = "medical_research_papers"
UPLOAD_COLLECTION_NAME = "user_uploads"

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

        self.main_collection = self.client.get_collection(
            MAIN_COLLECTION_NAME
        )

        self.upload_collection = self.client.get_or_create_collection(
            name=UPLOAD_COLLECTION_NAME,
            metadata={"description": "User uploaded documents"}
        )

    def _query_collection(self, collection, query_embedding, top_k):
        if collection.count() == 0:
            return []

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, collection.count())
        )

        retrieved_chunks = []

        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        ids = results["ids"][0]

        distances = results.get("distances")

        if distances is not None:
            distances = distances[0]

        for i in range(len(documents)):
            retrieved_chunks.append({
                "chunk_id": ids[i],
                "text": documents[i],
                "metadata": metadatas[i],
                "score": None if distances is None else distances[i],
                "retrieval_source": collection.name
            })

        return retrieved_chunks

    def retrieve(self, query, top_k=TOP_K):
        query_embedding = self.model.encode(
            query,
            normalize_embeddings=True
        ).tolist()

        main_results = self._query_collection(
            self.main_collection,
            query_embedding,
            top_k
        )

        upload_results = self._query_collection(
            self.upload_collection,
            query_embedding,
            top_k
        )

        all_results = main_results + upload_results

        all_results = sorted(
            all_results,
            key=lambda x: float("inf") if x["score"] is None else x["score"]
        )

        return all_results[:top_k]