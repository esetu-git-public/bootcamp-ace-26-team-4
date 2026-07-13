import sys
from types import ModuleType

# HybridRetriever imports production retrievers, which import sentence-transformers.
# These tests replace it before import because no model is constructed or exercised.
sentence_transformers = ModuleType("sentence_transformers")
sentence_transformers.CrossEncoder = object
sentence_transformers.SentenceTransformer = object
sys.modules.setdefault("sentence_transformers", sentence_transformers)

from rag.src.evidence.contradiction_detector import ContradictionDetector
from rag.src.retrieval.hybrid_retriever import HybridRetriever


class StubRetriever:
    def __init__(self, results):
        self.results = results
        self.calls = []

    def retrieve(self, *args, **kwargs):
        self.calls.append((args, kwargs))
        return self.results


class StubReranker:
    def rerank(self, query, chunks):
        return chunks


def test_hybrid_retriever_obeys_source_selection():
    retriever = HybridRetriever.__new__(HybridRetriever)
    retriever.dense = StubRetriever([])
    retriever.upload = StubRetriever([])
    retriever.bm25 = StubRetriever([])
    retriever.reranker = StubReranker()

    retriever.retrieve(
        "test query", include_medical=False, include_uploads=True
    )

    assert retriever.dense.calls == []
    assert len(retriever.upload.calls) == 1
    assert retriever.bm25.calls[0][1]["collections"] == ["user_uploads"]


def test_contradictions_require_conflicting_effect_signals():
    papers = [
        {"title": "No effect", "chunks": [{"text": "The treatment had no significant effect."}]},
        {"title": "Effect", "chunks": [{"text": "The treatment significantly reduced symptoms."}]},
        {"title": "Same type only", "chunks": [{"text": "Methods are described."}]},
    ]

    contradictions = ContradictionDetector().detect(papers)

    assert len(contradictions) == 1
    assert contradictions[0]["papers"] == ["No effect", "Effect"]
