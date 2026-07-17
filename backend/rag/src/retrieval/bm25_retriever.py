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
        from qdrant_client.models import Filter, FieldCondition, MatchText, MatchValue

        clean_query = " ".join([word for word in query.lower().split() if word])
        if not clean_query:
            return []

        results = []

        for collection in (collections if collections is not None else self.collections):
            try:
                must_conditions = [
                    FieldCondition(
                        key="text",
                        match=MatchText(text=clean_query)
                    )
                ]

                if collection == "user_uploads" and filename:
                    must_conditions.append(
                        FieldCondition(
                            key="filename",
                            match=MatchValue(value=filename)
                        )
                    )

                # Fetch points matching the query from Qdrant directly
                points, _ = self.client.scroll(
                    collection_name=collection,
                    scroll_filter=Filter(must=must_conditions),
                    limit=top_k * 2,
                    with_payload=True,
                    with_vectors=False,
                )

                for point in points:
                    payload = point.payload or {}
                    text = payload.get("text", "")
                    if not text:
                        continue

                    # Calculate overlap score
                    text_lower = text.lower()
                    query_words = clean_query.split()
                    matches = sum(word in text_lower for word in query_words)
                    
                    results.append({
                        "chunk_id": str(point.id),
                        "text": text,
                        "metadata": {
                            key: value for key, value in payload.items()
                            if key != "text"
                        },
                        "score": float(matches),
                    })
            except Exception as exc:
                print(f"Keyword retrieval failed for {collection}: {exc}")

        results.sort(key=lambda item: item["score"], reverse=True)
        return results[:top_k]

