import pytest
from unittest.mock import MagicMock

from rag.src.retrieval.hybrid_retriever import HybridRetriever


# =====================================================
# Fixture
# =====================================================

@pytest.fixture
def retriever():
    """
    Create a HybridRetriever instance with mocked
    DenseRetriever and BM25Retriever.
    """
    hr = HybridRetriever()
    hr.dense = MagicMock()
    hr.bm25 = MagicMock()
    return hr


# =====================================================
# Constructor Tests
# =====================================================

def test_initialization():
    """
    Verify HybridRetriever initializes successfully.
    """
    hr = HybridRetriever()

    assert hr.dense is not None
    assert hr.bm25 is not None


# =====================================================
# RRF Score Tests
# =====================================================

def test_rrf_score_default(retriever):
    score = retriever._rrf_score(rank=1)
    assert score == pytest.approx(1 / 61)


def test_rrf_score_custom_k(retriever):
    score = retriever._rrf_score(rank=5, k=100)
    assert score == pytest.approx(1 / 105)


# =====================================================
# Dense Retriever Only
# =====================================================

def test_dense_only(retriever):

    retriever.dense.retrieve.return_value = [
        {
            "chunk_id": "1",
            "text": "Diabetes symptoms",
            "metadata": {"title": "Paper1"},
            "score": 0.95
        }
    ]

    retriever.bm25.retrieve.return_value = []

    results = retriever.retrieve("diabetes")

    retriever.dense.retrieve.assert_called_once_with(
        "diabetes",
        top_k=10
    )

    retriever.bm25.retrieve.assert_called_once_with(
        "diabetes",
        top_k=10
    )

    assert len(results) == 1
    assert results[0]["chunk_id"] == "1"
    assert results[0]["dense_score"] == 0.95
    assert results[0]["bm25_score"] is None
    assert results[0]["retrieval_sources"] == ["dense"]


# =====================================================
# BM25 Retriever Only
# =====================================================

def test_bm25_only(retriever):

    retriever.dense.retrieve.return_value = []

    retriever.bm25.retrieve.return_value = [
        {
            "chunk_id": "2",
            "text": "Insulin treatment",
            "metadata": {"title": "Paper2"},
            "score": 18.2
        }
    ]

    results = retriever.retrieve("insulin")

    assert len(results) == 1
    assert results[0]["chunk_id"] == "2"
    assert results[0]["dense_score"] is None
    assert results[0]["bm25_score"] == 18.2
    assert results[0]["retrieval_sources"] == ["bm25"]


# =====================================================
# Hybrid Fusion
# =====================================================

def test_rrf_fusion(retriever):

    retriever.dense.retrieve.return_value = [
        {
            "chunk_id": "A",
            "text": "Shared Chunk",
            "metadata": {"title": "Paper"},
            "score": 0.90
        }
    ]

    retriever.bm25.retrieve.return_value = [
        {
            "chunk_id": "A",
            "text": "Shared Chunk",
            "metadata": {"title": "Paper"},
            "score": 16
        }
    ]

    results = retriever.retrieve("heart disease")

    expected = (1 / 61) + (1 / 61)

    assert len(results) == 1
    assert results[0]["rrf_score"] == pytest.approx(expected)
    assert "dense" in results[0]["retrieval_sources"]
    assert "bm25" in results[0]["retrieval_sources"]


# =====================================================
# Duplicate Merge
# =====================================================

def test_duplicate_chunks_are_merged(retriever):

    retriever.dense.retrieve.return_value = [
        {
            "chunk_id": "10",
            "text": "ABC",
            "metadata": {},
            "score": 0.8
        }
    ]

    retriever.bm25.retrieve.return_value = [
        {
            "chunk_id": "10",
            "text": "ABC",
            "metadata": {},
            "score": 12
        }
    ]

    results = retriever.retrieve("query")

    assert len(results) == 1
    assert results[0]["chunk_id"] == "10"
    assert len(results[0]["retrieval_sources"]) == 2
    assert "dense" in results[0]["retrieval_sources"]
    assert "bm25" in results[0]["retrieval_sources"]


# =====================================================
# Ranking Test
# =====================================================

def test_results_are_sorted(retriever):

    retriever.dense.retrieve.return_value = [
        {
            "chunk_id": "1",
            "text": "First",
            "metadata": {},
            "score": 0.9
        },
        {
            "chunk_id": "2",
            "text": "Second",
            "metadata": {},
            "score": 0.8
        }
    ]

    retriever.bm25.retrieve.return_value = []

    results = retriever.retrieve("query")

    assert results[0]["rrf_score"] >= results[1]["rrf_score"]
    assert results[0]["chunk_id"] == "1"


# =====================================================
# Top-K Test
# =====================================================

def test_top_k_limit(retriever):

    retriever.dense.retrieve.return_value = [
        {
            "chunk_id": str(i),
            "text": f"Doc {i}",
            "metadata": {},
            "score": 1
        }
        for i in range(10)
    ]

    retriever.bm25.retrieve.return_value = []

    results = retriever.retrieve("query", top_k=5)

    retriever.dense.retrieve.assert_called_once_with(
        "query",
        top_k=10
    )

    assert len(results) == 5


# =====================================================
# Empty Results
# =====================================================

def test_empty_results(retriever):

    retriever.dense.retrieve.return_value = []
    retriever.bm25.retrieve.return_value = []

    results = retriever.retrieve("anything")

    assert results == []


# =====================================================
# Metadata Preservation
# =====================================================

def test_metadata_preserved(retriever):

    metadata = {
        "title": "Medical Paper",
        "journal": "Nature"
    }

    retriever.dense.retrieve.return_value = [
        {
            "chunk_id": "1",
            "text": "abc",
            "metadata": metadata,
            "score": 1
        }
    ]

    retriever.bm25.retrieve.return_value = []

    results = retriever.retrieve("query")

    assert results[0]["metadata"] == metadata


# =====================================================
# Text Preservation
# =====================================================

def test_text_preserved(retriever):

    retriever.dense.retrieve.return_value = [
        {
            "chunk_id": "1",
            "text": "Original Text",
            "metadata": {},
            "score": 1
        }
    ]

    retriever.bm25.retrieve.return_value = []

    results = retriever.retrieve("query")

    assert results[0]["text"] == "Original Text"


# =====================================================
# Retrieval Sources
# =====================================================

def test_retrieval_sources(retriever):

    retriever.dense.retrieve.return_value = [
        {
            "chunk_id": "1",
            "text": "abc",
            "metadata": {},
            "score": 1
        }
    ]

    retriever.bm25.retrieve.return_value = []

    results = retriever.retrieve("query")

    assert results[0]["retrieval_sources"] == ["dense"]


# =====================================================
# Exception Handling
# =====================================================

def test_invalid_query(retriever):

    retriever.dense.retrieve.side_effect = ValueError("Invalid query")

    with pytest.raises(ValueError):
        retriever.retrieve(None)