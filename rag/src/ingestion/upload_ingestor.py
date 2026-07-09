from pathlib import Path
from uuid import uuid4

import chromadb
from pypdf import PdfReader
from docx import Document
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parents[2]

CHROMA_DIR = BASE_DIR / "data" / "vector_store" / "chroma_db"
COLLECTION_NAME = "user_uploads"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

CHUNK_SIZE_WORDS = 600
CHUNK_OVERLAP_WORDS = 100


class UploadIngestor:
    def __init__(self):
        self.model = SentenceTransformer(MODEL_NAME)

        self.client = chromadb.PersistentClient(
            path=str(CHROMA_DIR)
        )

        self.collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"description": "User uploaded documents"}
        )

    def ingest(self, file_path: str):
        file_path = Path(file_path)

        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        text = self._extract_text(file_path)

        if not text.strip():
            raise ValueError("No readable text found in uploaded file.")

        chunks = self._split_into_chunks(text)

        if not chunks:
            raise ValueError("No chunks generated from uploaded file.")

        ids = []
        documents = []
        metadatas = []

        upload_id = str(uuid4())

        for index, chunk_text in enumerate(chunks):
            chunk_id = f"{upload_id}_{index}"

            ids.append(chunk_id)
            documents.append(chunk_text)
            metadatas.append({
                "upload_id": upload_id,
                "filename": file_path.name,
                "source_file": file_path.name,
                "file_type": file_path.suffix.lower(),
                "chunk_index": index,
                "title": file_path.stem,
                "journal": "User Uploaded Document",
                "publication_year": "Unknown",
                "pmc_id": upload_id,
            })

        embeddings = self.model.encode(
            documents,
            normalize_embeddings=True,
            show_progress_bar=False
        ).tolist()

        self.collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings
        )

        return {
            "upload_id": upload_id,
            "filename": file_path.name,
            "chunks_added": len(chunks),
            "collection": COLLECTION_NAME
        }

    def _extract_text(self, file_path: Path) -> str:
        suffix = file_path.suffix.lower()

        if suffix == ".pdf":
            return self._extract_pdf(file_path)

        if suffix == ".docx":
            return self._extract_docx(file_path)

        if suffix in [".txt", ".md", ".csv"]:
            return file_path.read_text(encoding="utf-8", errors="ignore")

        raise ValueError(
            f"Unsupported file type: {suffix}. Supported: PDF, DOCX, TXT, MD, CSV"
        )

    def _extract_pdf(self, file_path: Path) -> str:
        reader = PdfReader(str(file_path))

        pages = []

        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)

        return "\n\n".join(pages)

    def _extract_docx(self, file_path: Path) -> str:
        doc = Document(str(file_path))

        paragraphs = []

        for para in doc.paragraphs:
            if para.text.strip():
                paragraphs.append(para.text.strip())

        return "\n".join(paragraphs)

    def _split_into_chunks(self, text: str):
        words = " ".join(text.split()).split()

        chunks = []
        start = 0

        while start < len(words):
            end = start + CHUNK_SIZE_WORDS
            chunk = " ".join(words[start:end])
            chunks.append(chunk)

            if end >= len(words):
                break

            start = end - CHUNK_OVERLAP_WORDS

        return chunks