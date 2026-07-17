import os
import threading
from dotenv import load_dotenv
from qdrant_client import QdrantClient


load_dotenv()


_qdrant_client_instance = None
_lock = threading.Lock()


def get_qdrant_client() -> QdrantClient:
    """Returns a shared thread-safe singleton instance of QdrantClient."""
    global _qdrant_client_instance
    if _qdrant_client_instance is None:
        with _lock:
            if _qdrant_client_instance is None:
                print("Connecting to Qdrant (initializing shared client)...")
                _qdrant_client_instance = QdrantClient(
                    url=os.getenv("QDRANT_URL"),
                    api_key=os.getenv("QDRANT_API_KEY")
                )
    return _qdrant_client_instance