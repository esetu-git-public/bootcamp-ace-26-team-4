from rag.src.vector_db.qdrant_connection import get_qdrant_client


TOP_K = 5


class BM25Retriever:
    """Keyword retrieval over Qdrant payloads.

    The name is retained for compatibility, but this is a simple keyword
    overlap scorer rather than a true BM25 index.
    """

    def __init__(self):
        print("Initializing Keyword Retriever...")
        self.client = get_qdrant_client()
        self.collections = ["medical_research_papers", "user_uploads"]

    def retrieve(self, query, top_k=TOP_K, collections=None, filename=None):
        query_words = [word for word in query.lower().split() if word]
        results = []

        for collection in (collections if collections is not None else self.collections):
            try:
                offset = None
                while True:
                    points, offset = self.client.scroll(
                        collection_name=collection,
                        limit=200,
                        offset=offset,
                        with_payload=True,
                        with_vectors=False,
                    )

                    for point in points:
                        payload = point.payload or {}
                        if collection == "user_uploads" and filename:
                            if payload.get("filename") != filename:
                                continue
                        text = payload.get("text", "")
                        if not text:
                            continue

                        text_lower = text.lower()
                        matches = sum(word in text_lower for word in query_words)
                        if matches:
                            results.append({
                                "chunk_id": str(point.id),
                                "text": text,
                                "metadata": {
                                    key: value for key, value in payload.items()
                                    if key != "text"
                                },
                                "score": float(matches),
                            })

                    if offset is None:
                        break
            except Exception as exc:
                print(f"Keyword retrieval failed for {collection}: {exc}")

        results.sort(key=lambda item: item["score"], reverse=True)
        return results[:top_k]
