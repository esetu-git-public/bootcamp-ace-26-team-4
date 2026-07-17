from pathlib import Path
import os

from dotenv import load_dotenv
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer


load_dotenv()


MAIN_COLLECTION_NAME = "medical_research_papers"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

TOP_K = 5


from rag.src.llm.embedding_model import get_embedding_model


class DenseRetriever:

    def __init__(self):

        self.model = get_embedding_model()


        from rag.src.vector_db.qdrant_connection import get_qdrant_client
        self.client = get_qdrant_client()


        self.collection_name = MAIN_COLLECTION_NAME


    def _query_collection(self, query_embedding, top_k):

        results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_embedding,
            limit=top_k
        )


        retrieved_chunks = []


        for point in results.points:

            retrieved_chunks.append({

                "chunk_id": str(point.id),

                "text": point.payload.get("text"),

                "metadata": {
                    key: value
                    for key, value in point.payload.items()
                    if key != "text"
                },

                "score": point.score,

                "retrieval_source": self.collection_name
            })


        return retrieved_chunks



    def retrieve(self, query, top_k=TOP_K):

        import torch
        with torch.no_grad():
            query_embedding = self.model.encode(
                query,
                normalize_embeddings=True
            ).tolist()


        results = self._query_collection(
            query_embedding,
            top_k
        )


        return results
