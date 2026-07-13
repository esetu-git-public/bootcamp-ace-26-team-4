import json
from pathlib import Path
from typing import Any, Iterable, Iterator, TextIO

from sentence_transformers import SentenceTransformer
from tqdm import tqdm


BASE_DIR = Path(__file__).resolve().parents[1]

INPUT_PATH = BASE_DIR / "data" / "chunks" / "chunks.jsonl"
OUTPUT_PATH = BASE_DIR / "data" / "embeddings" / "chunk_embeddings.jsonl"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
BATCH_SIZE = 64
CHUNK_METADATA_FIELDS = (
    "chunk_id",
    "pmc_id",
    "title",
    "journal",
    "publication_year",
    "chunk_index",
    "text",
    "source_file",
)

Chunk = dict[str, Any]


def load_chunks(path: Path) -> Iterator[Chunk]:
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                yield json.loads(line)


def batched(items: Iterable[Chunk], batch_size: int) -> Iterator[list[Chunk]]:
    batch: list[Chunk] = []

    for item in items:
        batch.append(item)

        if len(batch) == batch_size:
            yield batch
            batch = []

    if batch:
        yield batch


def build_embedded_chunk(chunk: Chunk, embedding: Any) -> Chunk:
    record = {field: chunk[field] for field in CHUNK_METADATA_FIELDS}
    record["embedding"] = embedding.tolist()
    return record


def write_jsonl(file: TextIO, record: Chunk) -> None:
    file.write(json.dumps(record, ensure_ascii=False) + "\n")


def embed_chunks(
    model: SentenceTransformer,
    chunks: list[Chunk],
    out_file: TextIO,
) -> int:
    texts = [chunk["text"] for chunk in chunks]
    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=False,
    )

    for chunk, embedding in zip(chunks, embeddings):
        write_jsonl(out_file, build_embedded_chunk(chunk, embedding))

    return len(chunks)


def main() -> None:
    if not INPUT_PATH.exists():
        raise FileNotFoundError(f"Input chunks file not found: {INPUT_PATH}")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    print(f"Loading embedding model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)
    total = 0

    with OUTPUT_PATH.open("w", encoding="utf-8") as out_file:
        chunk_batches = batched(load_chunks(INPUT_PATH), BATCH_SIZE)

        for chunks in tqdm(chunk_batches, desc="Embedding chunks"):
            total += embed_chunks(model, chunks, out_file)

    print("Embedding completed")
    print(f"Total embedded chunks: {total}")
    print(f"Output saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
