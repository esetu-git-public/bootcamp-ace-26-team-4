from pathlib import Path
import shutil
import os

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from rag.src.response.response_generator import ResponseGenerator
from rag.src.ingestion.upload_ingestor import UploadIngestor


router = APIRouter()

generator = ResponseGenerator()
upload_ingestor = UploadIngestor()

UPLOAD_DIR = Path("rag/data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class AskRequest(BaseModel):
    question: str
    template: str = "chat"


GREETINGS = {
    "hi",
    "hello",
    "hey",
    "hii",
    "helo",
    "good morning",
    "good afternoon",
    "good evening",
}


def is_greeting(text: str) -> bool:
    cleaned = text.strip().lower()
    return cleaned in GREETINGS


@router.post("/ask")
def ask(request: AskRequest):

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question is required"
        )

    if is_greeting(question):
        return {
            "question": question,
            "answer": (
                "Hello! Ask me a question about the medical knowledge base "
                "or the uploaded document."
            ),
            "references": [],
            "formatted_references": "",
            "metadata": {
                "template": request.template,
                "retrieved_chunks": 0,
                "references": 0,
                "retrieval_confidence_score": 0,
                "retrieval_confidence_level": "Not applicable"
            }
        }

    try:

        result = generator.generate_answer(
            question=question,
            template=request.template
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    allowed_extensions = {
        ".pdf",
        ".docx",
        ".txt",
        ".md",
        ".csv",
        ".xml",
    }

    file_ext = Path(file.filename).suffix.lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Supported files: PDF, DOCX, TXT, MD, CSV, XML"
        )

    try:


        for existing_file in UPLOAD_DIR.iterdir():

            if existing_file.is_file():

                existing_file.unlink()


        save_path = UPLOAD_DIR / file.filename

        with save_path.open("wb") as buffer:

            shutil.copyfileobj(file.file, buffer)


        ingestion_result = upload_ingestor.ingest(
            str(save_path)
        )



        return {

            "message": "File uploaded and indexed successfully",

            "current_document": file.filename,

            "filename": file.filename,

            "path": str(save_path),

            "ingestion": ingestion_result

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/")
def health():

    return {
        "status": "ok",
        "message": "Medical RAG API running"
    }
@router.get("/current-document")
def current_document():

    files = list(UPLOAD_DIR.glob("*"))

    if not files:
        return {
            "document": None,
            "message": "No document uploaded"
        }

    file = files[0]

    return {
        "filename": file.name,
        "size": file.stat().st_size,
        "last_modified": file.stat().st_mtime,
        "status": "Indexed"
    }

@router.delete("/upload/{filename}")
def delete_uploaded_file(filename: str):

    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    try:
        os.remove(file_path)

        return {
            "message": "File deleted successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )