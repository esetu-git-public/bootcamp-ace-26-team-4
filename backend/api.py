from pathlib import Path
import json
import os
import shutil
import threading
import time

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Header, status

from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, validator

import auth

from pydantic import BaseModel

from rag.evaluation.evaluator import EvaluationPausedError, Evaluator
from rag.src.response.response_generator import ResponseGenerator
from rag.src.ingestion.upload_ingestor import UploadIngestor
from rag.src.ingestion.deletion_manager import UploadDeletionManager


router = APIRouter()

generator = ResponseGenerator()
upload_ingestor = UploadIngestor()
deletion_manager = UploadDeletionManager()
evaluation_lock = threading.Lock()

UPLOAD_DIR = Path("rag/data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
EVALUATION_TEST_FILE = Path("rag/evaluation/test_questions.json")
EVALUATION_RESULTS_FILE = Path("rag/evaluation/evaluation_results.json")
FEEDBACK_FILE = Path("rag/data/feedback.json")
feedback_lock = threading.Lock()


class AskRequest(BaseModel):
    question: str
    template: str = "chat"


class FeedbackItem(BaseModel):
    messageId: str
    question: str = ""
    answer: str
    rating: Literal["up", "down"]
    comment: Optional[str] = None
    timestamp: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

    @validator('email')
    def must_be_gmail(cls, v):
        if not v.lower().endswith('@gmail.com'):
            raise ValueError('Only Gmail addresses are allowed')
        return v

    @validator('password')
    def password_min_length(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @validator('email')
    def must_be_gmail_login(cls, v):
        if not v.lower().endswith('@gmail.com'):
            raise ValueError('Only Gmail addresses are allowed')
        return v

    @validator('password')
    def password_not_empty(cls, v):
        if len(v) < 1:
            raise ValueError('Password is required')
        return v


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


def get_current_user(authorization: str = Header(None)):
    """Dependency to retrieve and validate the current user from Authorization header.

    Expects header: Authorization: Bearer <token>
    """
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header")
    token = parts[1]
    payload = auth.decode_jwt(token)
    email = payload.get("sub")
    user = auth.get_user(email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def is_greeting(text: str) -> bool:
    cleaned = text.strip().lower()
    return cleaned in GREETINGS


def get_current_user_optional(authorization: str = Header(None)):
    """Like get_current_user, but returns None instead of raising when the
    caller has no or an invalid/expired token. Used for feedback submission
    so logged-out or expired sessions can still leave feedback anonymously.
    """
    if not authorization:
        return None
    try:
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None
        payload = auth.decode_jwt(parts[1])
        return auth.get_user(payload.get("sub"))
    except Exception:
        return None


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


@router.post('/auth/register')
def auth_register(req: RegisterRequest):
    """Register a new user and return a JWT token."""
    try:
        user = auth.create_user(req.email, req.password, req.name)
        token = auth.create_jwt_for_user(user)
        return {"access_token": token, "token_type": "bearer", "user": {"email": user["email"], "name": user.get("name")}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/auth/login')
def auth_login(req: LoginRequest):
    """Login a user and return a JWT token."""
    try:
        user = auth.verify_user(req.email, req.password)
        token = auth.create_jwt_for_user(user)
        return {"access_token": token, "token_type": "bearer", "user": {"email": user["email"], "name": user.get("name")}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/auth/me')
def auth_me(current_user: dict = Depends(get_current_user)):
    return {"user": {"email": current_user["email"], "name": current_user.get("name")}}


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


@router.post("/feedback")
def submit_feedback(item: FeedbackItem, current_user: dict = Depends(get_current_user_optional)):
    """Save a thumbs up/down rating (with optional comment) for a chat answer."""
    entry = item.dict()
    entry["user_email"] = current_user["email"] if current_user else None
    entry["received_at"] = time.time()

    with feedback_lock:
        FEEDBACK_FILE.parent.mkdir(parents=True, exist_ok=True)
        if FEEDBACK_FILE.exists():
            try:
                with FEEDBACK_FILE.open("r", encoding="utf-8") as f:
                    feedback_log = json.load(f)
            except (OSError, json.JSONDecodeError):
                feedback_log = []
        else:
            feedback_log = []

        feedback_log.append(entry)

        with FEEDBACK_FILE.open("w", encoding="utf-8") as f:
            json.dump(feedback_log, f, indent=2)

    return {"status": "success", "message": "Feedback recorded"}


@router.get("/feedback")
def list_feedback(current_user: dict = Depends(get_current_user)):
    """Return all submitted feedback. Requires a logged-in user; the
    frontend additionally restricts which users can see this page via
    frontend/src/adminConfig.ts.
    """
    if not FEEDBACK_FILE.exists():
        return {"feedback": [], "count": 0}

    try:
        with FEEDBACK_FILE.open("r", encoding="utf-8") as f:
            feedback_log = json.load(f)
    except (OSError, json.JSONDecodeError):
        feedback_log = []

    # Most recent first
    feedback_log = sorted(feedback_log, key=lambda x: x.get("received_at", 0), reverse=True)

    return {"feedback": feedback_log, "count": len(feedback_log)}


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
        # Remove previous uploaded file if it has the same filename
        # ----------------------------------------------------
        deletion_manager.delete_by_filename(safe_filename)

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


@router.get("/uploads")
def list_uploads():
    """List all uploaded files in the uploads directory."""
    try:
        files = deletion_manager.list_uploaded_files()
        return {
            "files": files,
            "count": len(files)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing uploads: {str(e)}"
        )


@router.delete("/uploads/{filename}")
def delete_upload(filename: str):
    """
    Delete an uploaded PDF file and all its chunks from Qdrant.

    Parameters:
    - filename: The name of the file to delete (e.g., 'Heart_Attack.pdf')

    Returns:
    - Status of deletion from disk and Qdrant
    """
    # Security: prevent directory traversal
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename. Directory traversal not allowed."
        )

    try:
        result = deletion_manager.delete_by_filename(filename)

        if not result["success"]:
            raise HTTPException(
                status_code=404,
                detail=f"Could not delete {filename}. {result['disk_message']} {result['qdrant_message']}"
            )

        return {
            "status": "success",
            "message": f"Successfully deleted {filename}",
            "details": {
                "filename": result["filename"],
                "deleted_from_disk": result["deleted_from_disk"],
                "disk_message": result["disk_message"],
                "chunks_deleted_from_qdrant": result["chunks_deleted"],
                "qdrant_message": result["qdrant_message"]
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting upload: {str(e)}"
        )