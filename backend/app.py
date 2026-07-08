from fastapi import FastAPI
from backend.api import router

app = FastAPI(
    title="MRP Medical Research RAG API"
)

app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "MRP RAG API is running"
    }