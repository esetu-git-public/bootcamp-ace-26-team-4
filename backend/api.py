from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

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