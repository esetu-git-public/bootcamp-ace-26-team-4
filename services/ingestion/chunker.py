from pathlib import Path
import json


BASE_DIR = Path(__file__).resolve().parents[1]

INPUT_PATH = BASE_DIR / "data" / "processed" / "papers.jsonl"
OUTPUT_PATH = BASE_DIR / "data" / "chunks" / "chunks.jsonl"

CHUNK_SIZE_WORDS = 1000
CHUNK_OVERLAP_WORDS = 150


def clean_text(text):
    if not text:
        return ""
    return " ".join(text.split())


def split_into_chunks(text, chunk_size=CHUNK_SIZE_WORDS, overlap=CHUNK_OVERLAP_WORDS):
    words = clean_text(text).split()

    if not words:
        return []

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunks.append(" ".join(chunk_words))

        if end >= len(words):
            break

        start = end - overlap

    return chunks


def build_paper_text(paper):
    title = clean_text(paper.get("title", ""))
    abstract = clean_text(paper.get("abstract", ""))
    body_text = clean_text(paper.get("body_text", ""))

    sections = []

    if title:
        sections.append(f"Title: {title}")

    if abstract:
        sections.append(f"Abstract: {abstract}")

    if body_text:
        sections.append(f"Body: {body_text}")

    return "\n\n".join(sections)


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    total_papers = 0
    total_chunks = 0
    skipped_papers = 0

    with INPUT_PATH.open("r", encoding="utf-8") as in_file, OUTPUT_PATH.open("w", encoding="utf-8") as out_file:
        for line in in_file:
            if not line.strip():
                continue

            paper = json.loads(line)
            total_papers += 1

            full_text = build_paper_text(paper)
            chunks = split_into_chunks(full_text)

            if not chunks:
                skipped_papers += 1
                continue

            for idx, chunk_text in enumerate(chunks):
                chunk = {
                    "chunk_id": f"{paper.get('pmc_id', 'unknown')}_{idx}",
                    "pmc_id": paper.get("pmc_id", ""),
                    "title": paper.get("title", ""),
                    "journal": paper.get("journal", ""),
                    "publication_year": paper.get("publication_year", ""),
                    "chunk_index": idx,
                    "text": chunk_text,
                    "source_file": paper.get("source_file", ""),
                }

                out_file.write(json.dumps(chunk, ensure_ascii=False) + "\n")
                total_chunks += 1

    print("Chunking completed")
    print(f"Total papers: {total_papers}")
    print(f"Total chunks: {total_chunks}")
    print(f"Skipped papers: {skipped_papers}")
    print(f"Output saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()