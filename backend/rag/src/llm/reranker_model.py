import threading
import torch
from sentence_transformers import CrossEncoder

# Limit PyTorch CPU threads globally to prevent memory bloat on multi-core server hosts
try:
    torch.set_num_threads(1)
    torch.set_num_interop_threads(1)
except RuntimeError:
    pass

MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L-6-v2"

_reranker_instance = None
_lock = threading.Lock()

def get_reranker_model() -> CrossEncoder:
    """Returns a shared thread-safe singleton instance of the CrossEncoder model."""
    global _reranker_instance
    if _reranker_instance is None:
        with _lock:
            if _reranker_instance is None:
                print(f"Loading shared CrossEncoder model ({MODEL_NAME})...")
                _reranker_instance = CrossEncoder(MODEL_NAME)
    return _reranker_instance
