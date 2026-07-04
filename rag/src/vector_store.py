from pathlib import Path
import json

import chromadb
from sentence_transformers import SentenceTransformer
from tqdm import tqdm


BASE_DIR = Path(__file__).resolve().parents[1]

CHUNKS_PATH = BASE_DIR / "data" / "chunks" / "chunks.jsonl"
CHROMA_DIR = BASE_DIR / "data" / "vector_store" / "chroma_db"

COLLECTION_NAME = "medical_research_papers"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
BATCH_SIZE = 64


def load_chunks():
    if not CHUNKS_PATH.exists():
        raise FileNotFoundError(f"Chunks file not found: {CHUNKS_PATH}")

    with CHUNKS_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                yield json.loads(line)


def main():
    print(f"Chunks path: {CHUNKS_PATH}")
    print(f"Chroma path: {CHROMA_DIR}")

    CHROMA_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Loading model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Medical research paper chunks"}
    )

    ids = []
    documents = []
    metadatas = []
    total_added = 0

    for chunk in tqdm(load_chunks(), desc="Indexing chunks"):
        ids.append(chunk["chunk_id"])
        documents.append(chunk["text"])

        metadatas.append({
            "pmc_id": chunk.get("pmc_id", ""),
            "title": chunk.get("title", ""),
            "journal": chunk.get("journal", ""),
            "publication_year": str(chunk.get("publication_year", "")),
            "chunk_index": int(chunk.get("chunk_index", 0)),
            "source_file": chunk.get("source_file", "")
        })

        if len(ids) == BATCH_SIZE:
            embeddings = model.encode(
                documents,
                normalize_embeddings=True,
                show_progress_bar=False
            ).tolist()

            collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas,
                embeddings=embeddings
            )

            total_added += len(ids)
            ids, documents, metadatas = [], [], []

    if ids:
        embeddings = model.encode(
            documents,
            normalize_embeddings=True,
            show_progress_bar=False
        ).tolist()

        collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings
        )

        total_added += len(ids)

    print("Vector store created successfully")
    print(f"Chunks added this run: {total_added}")
    print(f"Collection count: {collection.count()}")
    print(f"Saved at: {CHROMA_DIR}")


if __name__ == "__main__":
    main()