from pathlib import Path
import json
from sentence_transformers import SentenceTransformer
from tqdm import tqdm


BASE_DIR = Path(__file__).resolve().parents[1]

INPUT_PATH = BASE_DIR / "data" / "chunks" / "chunks.jsonl"
OUTPUT_PATH = BASE_DIR / "data" / "embeddings" / "chunk_embeddings.jsonl"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
BATCH_SIZE = 64


def load_chunks(path):
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                yield json.loads(line)


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    print(f"Loading embedding model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)

    chunks_batch = []
    text_batch = []
    total = 0

    with OUTPUT_PATH.open("w", encoding="utf-8") as out_file:
        for chunk in tqdm(load_chunks(INPUT_PATH), desc="Embedding chunks"):
            chunks_batch.append(chunk)
            text_batch.append(chunk["text"])

            if len(text_batch) >= BATCH_SIZE:
                embeddings = model.encode(
                    text_batch,
                    normalize_embeddings=True,
                    show_progress_bar=False
                )

                for chunk_obj, embedding in zip(chunks_batch, embeddings):
                    output = {
                        "chunk_id": chunk_obj["chunk_id"],
                        "pmc_id": chunk_obj["pmc_id"],
                        "title": chunk_obj["title"],
                        "journal": chunk_obj["journal"],
                        "publication_year": chunk_obj["publication_year"],
                        "chunk_index": chunk_obj["chunk_index"],
                        "text": chunk_obj["text"],
                        "source_file": chunk_obj["source_file"],
                        "embedding": embedding.tolist(),
                    }

                    out_file.write(json.dumps(output, ensure_ascii=False) + "\n")
                    total += 1

                chunks_batch = []
                text_batch = []

        if text_batch:
            embeddings = model.encode(
                text_batch,
                normalize_embeddings=True,
                show_progress_bar=False
            )

            for chunk_obj, embedding in zip(chunks_batch, embeddings):
                output = {
                    "chunk_id": chunk_obj["chunk_id"],
                    "pmc_id": chunk_obj["pmc_id"],
                    "title": chunk_obj["title"],
                    "journal": chunk_obj["journal"],
                    "publication_year": chunk_obj["publication_year"],
                    "chunk_index": chunk_obj["chunk_index"],
                    "text": chunk_obj["text"],
                    "source_file": chunk_obj["source_file"],
                    "embedding": embedding.tolist(),
                }

                out_file.write(json.dumps(output, ensure_ascii=False) + "\n")
                total += 1

    print("Embedding completed")
    print(f"Total embedded chunks: {total}")
    print(f"Output saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()