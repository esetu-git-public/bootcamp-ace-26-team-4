from pathlib import Path
import shutil

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
            "answer": "Hello! Ask me a specific question about the uploaded medical research papers.",
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

    save_path = UPLOAD_DIR / file.filename

    try:
        with save_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        ingestion_result = upload_ingestor.ingest(
            str(save_path)
        )

        return {
            "message": "File uploaded and indexed successfully",
            "filename": file.filename,
            "path": str(save_path),
            "ingestion": ingestion_result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )