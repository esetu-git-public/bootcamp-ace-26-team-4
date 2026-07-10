from qdrant_client.models import PayloadSchemaType

from rag.src.vector_db.qdrant_connection import get_qdrant_client


def create_indexes():

    client = get_qdrant_client()

    print("Connected to Qdrant")

    collections = [
        "user_uploads",
        "medical_research_papers"
    ]


    for collection in collections:

        print(
            f"Creating filename index in {collection}"
        )

        try:

            client.create_payload_index(
                collection_name=collection,
                field_name="filename",
                field_schema=PayloadSchemaType.KEYWORD
            )

            print(
                "Index created successfully"
            )

        except Exception as e:

            print(
                "Index creation error:",
                e
            )


if __name__ == "__main__":

    create_indexes()