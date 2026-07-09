from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi import  UploadFile, File
from pathlib import Path
import shutil

from rag.src.response.response_generator import ResponseGenerator

router = APIRouter()
generator = ResponseGenerator()


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
        raise HTTPException(status_code=400, detail="Question is required")

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
        raise HTTPException(status_code=500, detail=str(e))

UPLOAD_DIR = Path("rag/data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    allowed_extensions = {".pdf", ".xml", ".txt"}

    file_ext = Path(file.filename).suffix.lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, XML, and TXT files are supported"
        )

    save_path = UPLOAD_DIR / file.filename

    try:
        with save_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "path": str(save_path)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))