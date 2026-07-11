from rag.src.retrieval.dense_retriever import DenseRetriever
from rag.src.retrieval.upload_retriever import UploadRetriever
from rag.src.retrieval.bm25_retriever import BM25Retriever


class HybridRetriever:
    """
    Hybrid Retrieval Pipeline

    Sources:
        1. Medical research papers (Qdrant dense)
        2. User uploaded documents (Qdrant dense)
        3. BM25 keyword search

    Ranking:
        Reciprocal Rank Fusion (RRF)

    Uploaded documents get priority because
    they represent the user's active context.
    """

    def __init__(self):

        print("Initializing Hybrid Retriever...")

        self.dense = DenseRetriever()

        self.upload = UploadRetriever()

        self.bm25 = BM25Retriever()


    def _rrf_score(self, rank, k=60):

        return 1.0 / (k + rank)



    def retrieve(
        self,
        query,
        top_k=5,
        filename=None
    ):


        print("\n===== HYBRID RETRIEVAL =====")
        print("Query:", query)


        # ----------------------------
        # Dense medical knowledge base
        # ----------------------------

        dense_results = self.dense.retrieve(
            query,
            top_k=top_k * 2
        )


        # ----------------------------
        # Uploaded documents
        # ----------------------------

        upload_results = self.upload.retrieve(
            query,
            top_k=top_k * 2,
            filename=filename
        )


        # ----------------------------
        # BM25 keyword search
        # ----------------------------

        bm25_results = self.bm25.retrieve(
            query,
            top_k=top_k * 2
        )



        fused = {}



        # ==================================================
        # Uploaded document priority
        # ==================================================

        for rank, result in enumerate(
            upload_results,
            start=1
        ):

            chunk_id = result["chunk_id"]


            fused[chunk_id] = {

                "chunk_id": chunk_id,

                "text": result["text"],

                "metadata": result["metadata"],

                "rrf_score":
                    self._rrf_score(rank) + 0.05,

                "dense_score":
                    result.get("score"),

                "bm25_score":
                    None,

                "retrieval_sources": [
                    "user_uploads"
                ]

            }



        # ==================================================
        # Main medical corpus dense results
        # ==================================================

        for rank, result in enumerate(
            dense_results,
            start=1
        ):

            chunk_id = result["chunk_id"]


            if chunk_id not in fused:

                fused[chunk_id] = {

                    "chunk_id": chunk_id,

                    "text": result["text"],

                    "metadata": result["metadata"],

                    "rrf_score":
                        self._rrf_score(rank),

                    "dense_score":
                        result.get("score"),

                    "bm25_score":
                        None,

                    "retrieval_sources": [
                        "medical_dense"
                    ]

                }



        # ==================================================
        # BM25 fusion
        # ==================================================

        for rank, result in enumerate(
            bm25_results,
            start=1
        ):

            chunk_id = result["chunk_id"]


            if chunk_id in fused:


                fused[chunk_id]["rrf_score"] += (
                    self._rrf_score(rank)
                )


                fused[chunk_id]["bm25_score"] = (
                    result.get("score")
                )


                fused[chunk_id][
                    "retrieval_sources"
                ].append(
                    "bm25"
                )


            else:


                fused[chunk_id] = {

                    "chunk_id": chunk_id,

                    "text": result["text"],

                    "metadata": result["metadata"],

                    "rrf_score":
                        self._rrf_score(rank),

                    "dense_score":
                        None,

                    "bm25_score":
                        result.get("score"),

                    "retrieval_sources": [
                        "bm25"
                    ]

                }



        # ==================================================
        # Final ranking
        # ==================================================

        ranked_results = sorted(

            fused.values(),

            key=lambda x: x["rrf_score"],

            reverse=True

        )


        print(
            "Retrieved chunks:",
            len(ranked_results)
        )


        print("============================\n")


        return ranked_results[:top_k]