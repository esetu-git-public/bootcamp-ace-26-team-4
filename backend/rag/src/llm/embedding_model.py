import threading
import torch
from sentence_transformers import SentenceTransformer

# Limit PyTorch CPU threads globally to prevent memory bloat on multi-core server hosts
try:
    torch.set_num_threads(1)
    torch.set_num_interop_threads(1)
except RuntimeError:
    pass

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


def optimize_memory():
    """Forces aggressive garbage collection and releases cached PyTorch/glibc memory back to the OS."""
    import gc
    import torch
    
    # 1. Force Python garbage collection
    gc.collect()
    
    # 2. Empty PyTorch cache (CPU/CUDA if applicable)
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        
    # 3. Glibc malloc_trim (forces releasing pages to the OS)
    try:
        import ctypes
        libc = ctypes.CDLL("libc.so.6")
        libc.malloc_trim(0)
    except Exception:
        pass
