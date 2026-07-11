from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
from dotenv import load_dotenv
import os
import json


load_dotenv()


client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)


COLLECTION_NAME = "medical_research_papers"

embedding_file = "data/embeddings/chunk_embeddings.jsonl"


points = []


with open(embedding_file, "r", encoding="utf-8") as file:

    for idx, line in enumerate(file):

        item = json.loads(line)

        points.append(
            PointStruct(
                id=idx,
                vector=item["embedding"],
                payload={
                    "chunk_id": item["chunk_id"],
                    "pmc_id": item["pmc_id"],
                    "title": item["title"],
                    "journal": item["journal"],
                    "publication_year": item["publication_year"],
                    "chunk_index": item["chunk_index"],
                    "text": item["text"],
                    "source_file": item["source_file"]
                }
            )
        )


        # upload in batches
        if len(points) == 100:

            client.upsert(
                collection_name=COLLECTION_NAME,
                points=points
            )

            print(f"Uploaded {idx + 1} vectors")
            points = []


# remaining vectors
if points:

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )


print("Migration completed successfully")