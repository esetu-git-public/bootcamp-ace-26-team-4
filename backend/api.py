from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from rag.src.response.response_generator import ResponseGenerator

router = APIRouter()

generator = ResponseGenerator()


class AskRequest(BaseModel):
    question: str
    template: str = "chat"


@router.post("/ask")
def ask(request: AskRequest):
    try:
        result = generator.generate_answer(
            question=request.question,
            template=request.template
        )
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))