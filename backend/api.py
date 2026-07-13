from pathlib import Path
import json
import os
import shutil
import threading

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from rag.evaluation.evaluator import EvaluationPausedError, Evaluator
from rag.src.response.response_generator import ResponseGenerator
from rag.src.ingestion.upload_ingestor import UploadIngestor


router = APIRouter()

generator = ResponseGenerator()
upload_ingestor = UploadIngestor()
evaluation_lock = threading.Lock()

UPLOAD_DIR = Path("rag/data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
EVALUATION_TEST_FILE = Path("rag/evaluation/test_questions.json")
EVALUATION_RESULTS_FILE = Path("rag/evaluation/evaluation_results.json")


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


def _evaluation_report():
    """Return saved evaluation results together with an API-friendly summary."""
    with EVALUATION_TEST_FILE.open("r", encoding="utf-8") as file:
        tests = json.load(file)

    if EVALUATION_RESULTS_FILE.exists():
        with EVALUATION_RESULTS_FILE.open("r", encoding="utf-8") as file:
            results = json.load(file)
    else:
        results = []

    def average(field):
        scores = [item[field] for item in results if item.get(field) is not None]
        return round(sum(scores) / len(scores), 3) if scores else None

    return {
        "completed_questions": len(results),
        "total_questions": len(tests),
        "pending_questions": max(len(tests) - len(results), 0),
        "summary": {
            "average_keyword_recall": average("keyword_recall"),
            "average_precision_at_k": average("precision"),
            "average_recall_at_k": average("recall"),
        },
        "results": results,
    }


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


@router.get("/evaluation")
def get_evaluation_results():
    """Show the latest saved RAG evaluation scores without calling Gemini."""
    try:
        report = _evaluation_report()
        return {
            "status": "completed" if report["pending_questions"] == 0 else "in_progress",
            **report,
        }
    except (OSError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=500, detail=f"Unable to read evaluation results: {exc}")


@router.post("/evaluation/run")
def run_evaluation():
    """Run or resume the benchmark and return its saved results."""
    if not evaluation_lock.acquire(blocking=False):
        raise HTTPException(status_code=409, detail="An evaluation is already running")

    try:
        evaluator = Evaluator()
        delay_seconds = float(os.getenv("EVALUATION_REQUEST_DELAY_SECONDS", "8"))

        try:
            evaluator.evaluate(
                str(EVALUATION_TEST_FILE),
                results_file=str(EVALUATION_RESULTS_FILE),
                delay_seconds=delay_seconds,
            )
            status = "completed"
            message = "Evaluation completed successfully."
        except EvaluationPausedError as exc:
            status = "paused"
            message = str(exc)

        return {
            "status": status,
            "message": message,
            **_evaluation_report(),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        evaluation_lock.release()


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

    if not file.filename:
        raise HTTPException(status_code=400, detail="A filename is required")

    safe_filename = Path(file.filename).name
    file_ext = Path(safe_filename).suffix.lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Supported files: PDF, DOCX, TXT, MD, CSV, XML"
        )

    try:

        # ----------------------------------------------------
        # Remove previous uploaded files
        # ----------------------------------------------------

        for existing_file in UPLOAD_DIR.iterdir():

            if existing_file.is_file():

                existing_file.unlink()

        # ----------------------------------------------------
        # Save new file
        # ----------------------------------------------------

        save_path = UPLOAD_DIR / safe_filename

        with save_path.open("wb") as buffer:

            shutil.copyfileobj(file.file, buffer)

        # ----------------------------------------------------
        # Index into Chroma
        # ----------------------------------------------------

        ingestion_result = upload_ingestor.ingest(
            str(save_path)
        )

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {

            "message": "File uploaded and indexed successfully",

            "current_document": safe_filename,

            "filename": safe_filename,

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
