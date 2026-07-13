
TDD_upload_ingestor.py

Test-Driven Development (TDD) tests for upload_ingestor.py
Run with:
    pytest TDD_upload_ingestor.py

from pathlib import Path
from unittest.mock import MagicMock, patch
import pytest

from upload_ingestor import UploadIngestor


@pytest.fixture
def ingestor():
    with patch("upload_ingestor.SentenceTransformer") as mock_model, \
        patch("upload_ingestor.QdrantClient") as mock_client:

        mock_model.return_value.encode.return_value.tolist.return_value = [[0.1, 0.2, 0.3]]
        obj = UploadIngestor()
        obj.client = mock_client.return_value
        obj.model = mock_model.return_value
        return obj


def test_file_not_found(ingestor):
    with pytest.raises(FileNotFoundError):
        ingestor.ingest("missing.pdf")


def test_extract_text_unsupported_extension(ingestor, tmp_path):
    file = tmp_path / "image.jpg"
    file.write_text("dummy")

    with pytest.raises(ValueError, match="Unsupported file type"):
        ingestor._extract_text(file)


def test_split_into_chunks_small_text(ingestor):
    text = "hello world"
    chunks = ingestor._split_into_chunks(text)

    assert len(chunks) == 1
    assert chunks[0] == text


def test_split_into_multiple_chunks(ingestor):
    text = "word " * 1500
    chunks = ingestor._split_into_chunks(text)

    assert len(chunks) > 1


def test_chunk_overlap(ingestor):
    text = " ".join(f"w{i}" for i in range(1000))
    chunks = ingestor._split_into_chunks(text)

    if len(chunks) > 1:
        first = chunks[0].split()
        second = chunks[1].split()

        assert first[-100:] == second[:100]


def test_extract_txt(ingestor, tmp_path):
    file = tmp_path / "sample.txt"
    file.write_text("Hello World")

    assert ingestor._extract_text(file) == "Hello World"


@patch.object(UploadIngestor, "_extract_text")
@patch.object(UploadIngestor, "_split_into_chunks")
def test_ingest_success(mock_chunks, mock_extract, ingestor, tmp_path):

    file = tmp_path / "sample.txt"
    file.write_text("dummy")

    mock_extract.return_value = "Example text"
    mock_chunks.return_value = ["Chunk 1", "Chunk 2"]

    ingestor.model.encode.return_value.tolist.return_value = [
        [0.1, 0.2],
        [0.3, 0.4],
    ]

    result = ingestor.ingest(str(file))

    assert result["filename"] == "sample.txt"
    assert result["chunks_added"] == 2
    assert result["collection"] == "user_uploads"

    ingestor.client.upsert.assert_called_once()


@patch.object(UploadIngestor, "_extract_text")
def test_empty_document(mock_extract, ingestor, tmp_path):

    file = tmp_path / "sample.txt"
    file.write_text("")

    mock_extract.return_value = ""

    with pytest.raises(ValueError, match="No readable text found"):
        ingestor.ingest(str(file))


@patch.object(UploadIngestor, "_extract_text")
@patch.object(UploadIngestor, "_split_into_chunks")
def test_no_chunks_generated(mock_chunks, mock_extract, ingestor, tmp_path):

    file = tmp_path / "sample.txt"
    file.write_text("dummy")

    mock_extract.return_value = "Some text"
    mock_chunks.return_value = []

    with pytest.raises(ValueError, match="No chunks generated"):
        ingestor.ingest(str(file))
