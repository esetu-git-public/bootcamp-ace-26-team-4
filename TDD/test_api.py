import io
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend.app import app

client = TestClient(app)


# --------------------------------------------------
# Health Endpoint
# --------------------------------------------------

def test_health_endpoint():

    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "message": "Medical RAG API running"
    }


# --------------------------------------------------
# Greeting
# --------------------------------------------------

def test_greeting_returns_static_response():

    response = client.post(
        "/ask",
        json={
            "question": "hello"
        }
    )

    assert response.status_code == 200

    body = response.json()

    assert body["question"] == "hello"
    assert "Hello!" in body["answer"]
    assert body["references"] == []
    assert body["metadata"]["retrieved_chunks"] == 0


# --------------------------------------------------
# Empty Question
# --------------------------------------------------

def test_empty_question_returns_400():

    response = client.post(
        "/ask",
        json={
            "question": "   "
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Question is required"


# --------------------------------------------------
# Ask Success
# --------------------------------------------------

@patch("api.generator.generate_answer")
def test_ask_success(mock_generate):

    mock_generate.return_value = {
        "question": "What is diabetes?",
        "answer": "Mock answer",
        "references": [],
        "formatted_references": "",
        "metadata": {}
    }

    response = client.post(
        "/ask",
        json={
            "question": "What is diabetes?"
        }
    )

    assert response.status_code == 200
    assert response.json()["answer"] == "Mock answer"

    mock_generate.assert_called_once()


# --------------------------------------------------
# Ask Exception
# --------------------------------------------------

@patch("api.generator.generate_answer")
def test_ask_internal_error(mock_generate):

    mock_generate.side_effect = Exception("Generator Failed")

    response = client.post(
        "/ask",
        json={
            "question": "Cancer"
        }
    )

    assert response.status_code == 500
    assert response.json()["detail"] == "Generator Failed"


# --------------------------------------------------
# Upload Invalid Extension
# --------------------------------------------------

def test_upload_invalid_extension():

    response = client.post(
        "/upload",
        files={
            "file": (
                "virus.exe",
                io.BytesIO(b"dummy"),
                "application/octet-stream"
            )
        }
    )

    assert response.status_code == 400
    assert "Supported files" in response.json()["detail"]


# --------------------------------------------------
# Upload Success
# --------------------------------------------------

@patch("api.upload_ingestor.ingest")
def test_upload_success(mock_ingest):

    mock_ingest.return_value = {
        "chunks": 5
    }

    response = client.post(
        "/upload",
        files={
            "file": (
                "paper.txt",
                io.BytesIO(b"Medical document"),
                "text/plain"
            )
        }
    )

    assert response.status_code == 200

    body = response.json()

    assert body["filename"] == "paper.txt"
    assert body["message"] == "File uploaded and indexed successfully"

    mock_ingest.assert_called_once()


# --------------------------------------------------
# Upload Exception
# --------------------------------------------------

@patch("api.upload_ingestor.ingest")
def test_upload_internal_error(mock_ingest):

    mock_ingest.side_effect = Exception("Index failed")

    response = client.post(
        "/upload",
        files={
            "file": (
                "paper.txt",
                io.BytesIO(b"text"),
                "text/plain"
            )
        }
    )

    assert response.status_code == 500
    assert response.json()["detail"] == "Index failed"