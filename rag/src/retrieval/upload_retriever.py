import os

from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient


load_dotenv()


COLLECTION_NAME = "user_uploads"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

TOP_K = 5



class UploadRetriever:

    """
    Retrieves information only from user uploaded documents.
    """

    def __init__(self):

        print("Loading Upload Retriever...")


        self.model = SentenceTransformer(
            MODEL_NAME
        )


        print("Connecting to Qdrant...")


        self.client = QdrantClient(

            url=os.getenv("QDRANT_URL"),

            api_key=os.getenv("QDRANT_API_KEY")

        )


        self.collection_name = COLLECTION_NAME



    def retrieve(
        self,
        query: str,
        top_k: int = TOP_K,
        filename: str | None = None
    ):


        embedding = self.model.encode(

            query,

            normalize_embeddings=True

        ).tolist()



        query_filter = None


        if filename is not None:

            from qdrant_client.models import Filter, FieldCondition, MatchValue


            query_filter = Filter(

                must=[

                    FieldCondition(

                        key="filename",

                        match=MatchValue(
                            value=filename
                        )

                    )

                ]

            )



        results = self.client.query_points(

            collection_name=self.collection_name,

            query=embedding,

            limit=top_k,

            query_filter=query_filter

        )


        return self._format(results)



    def retrieve_latest(
        self,
        query: str,
        top_k: int = TOP_K
    ):

        return self.retrieve(
            query=query,
            top_k=top_k
        )



    def retrieve_by_filename(
        self,
        filename: str,
        query: str,
        top_k: int = TOP_K
    ):

        return self.retrieve(

            query=query,

            filename=filename,

            top_k=top_k

        )



    def _format(self, results):

        chunks = []


        for point in results.points:


            chunks.append({

                "chunk_id": point.id,


                "text": point.payload.get(
                    "text"
                ),


                "metadata": {

                    k: v

                    for k, v in point.payload.items()

                    if k != "text"

                },


                "score": point.score


            })


        return chunks