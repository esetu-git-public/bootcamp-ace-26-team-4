from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.api import router

app = FastAPI(
    title="MRP Medical Research RAG API"
)

app.include_router(router, prefix="/api")
client = TestClient(app)


@app.get("/")
def root():
    return {
        "message": "MRP RAG API is running"
    }