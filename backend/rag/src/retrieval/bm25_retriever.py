from rag.src.vector_db.qdrant_connection import get_qdrant_client


TOP_K = 5


class BM25Retriever:
    """
    Keyword Retriever using Qdrant payload.

    No local chunks.jsonl dependency.
    Works with Railway deployment.
    """

    def __init__(self):

        print("Initializing Keyword Retriever...")

        self.client = get_qdrant_client()

        self.collections = [
            "medical_research_papers",
            "user_uploads"
        ]


    def retrieve(
        self,
        query,
        top_k=TOP_K
    ):

        query_words = query.lower().split()

        results = []


        for collection in self.collections:

            try:

                points, _ = self.client.scroll(
                    collection_name=collection,
                    limit=200,
                    with_payload=True,
                    with_vectors=False
                )


                for point in points:

                    payload = point.payload or {}

                    text = payload.get(
                        "text",
                        ""
                    )


                    if not text:
                        continue


                    text_lower = text.lower()


                    matches = sum(
                        1
                        for word in query_words
                        if word in text_lower
                    )


                    if matches > 0:

                        results.append({

                            "chunk_id": str(point.id),

                            "text": text,

                            "metadata": payload,

                            "score": float(matches)

                        })


            except Exception as e:

                print(
                    f"Keyword retrieval failed for {collection}: {e}"
                )


        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )


        return results[:top_k]