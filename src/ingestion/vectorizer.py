from sentence_transformers import SentenceTransformer
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class MedicalVectorizer:
    def __init__(self, model_name: str = "pritamdeka/S-PubMedBert-MS-MARCO"):
        logger.info(f"Initializing local embedding model: {model_name}...")
        # This will download the weights (~400MB) on the first run, then cache them locally.
        self.model = SentenceTransformer(model_name)
        logger.info("Embedding model loaded successfully.")

    def embed_chunks(self, chunks: List[Dict]) -> List[Dict]:
        """
        Takes parsed XML chunks, extracts the text, generates dense vectors,
        and attaches the vectors back to the chunk dictionary.
        """
        if not chunks:
            return []
        
        # Isolate the text payload for the model
        texts = [chunk["text"] for chunk in chunks]
        logger.info(f"Vectorizing {len(texts)} chunks...")
        
        # Generate vectors (returns a numpy array)
        vectors = self.model.encode(texts, show_progress_bar=False)
        
        # Map the float arrays back to the original chunks
        for i, chunk in enumerate(chunks):
            # Convert numpy array to standard Python list for DB insertion
            chunk["vector"] = vectors[i].tolist()
            
        logger.info(f"Successfully attached vectors (dimension: {len(vectors[0])}) to chunks.")
        return chunks