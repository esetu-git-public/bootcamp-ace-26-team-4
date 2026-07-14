import threading
import torch
from sentence_transformers import SentenceTransformer

# Limit PyTorch CPU threads globally to prevent memory bloat on multi-core server hosts
torch.set_num_threads(1)
torch.set_num_interop_threads(1)

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

_model_instance = None
_lock = threading.Lock()

def get_embedding_model() -> SentenceTransformer:
    """Returns a shared thread-safe singleton instance of the embedding model."""
    global _model_instance
    if _model_instance is None:
        with _lock:
            if _model_instance is None:
                print(f"Loading shared embedding model ({MODEL_NAME})...")
                _model_instance = SentenceTransformer(MODEL_NAME)
    return _model_instance
