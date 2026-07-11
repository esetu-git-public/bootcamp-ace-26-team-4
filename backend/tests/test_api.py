from fastapi import FastAPI
from fastapi.testclient import TestClient

from api import router


app = FastAPI(title="MRP Medical Research RAG API")
app.include_router(router, prefix="/api")

client = TestClient(app)


def test_root_endpoint():
    @app.get("/")
    def root():
        return {"message": "MRP RAG API is running"}

    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "MRP RAG API is running"
    }

# Test for checking endpoint missing question
def test_ask_endpoint_missing_question():
    response = client.post("/api/ask", json={})

    assert response.status_code == 422