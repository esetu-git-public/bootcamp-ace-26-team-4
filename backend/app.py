from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from api import router
from rag.src.llm.embedding_model import optimize_memory

app = FastAPI(
    title="MRP Medical Research RAG API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "https://medical-research-paper-ai.up.railway.app",
    ],
    allow_credentials=False, # Temp dev
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.middleware("http")
async def memory_cleanup_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    finally:
        optimize_memory()

@app.get("/")
def root():
    return {
        "message": "MRP RAG API is running"
    }