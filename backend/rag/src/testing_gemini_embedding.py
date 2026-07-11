import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

try:
    response = client.models.embed_content(
        model="gemini-embedding-2",
        contents="What is diabetes?",
        config={
            "output_dimensionality": 1536
        }
    )

    embedding = response.embeddings[0].values

    print("✅ Gemini embedding model is available!")
    print(f"Embedding dimension: {len(embedding)}")

except Exception as e:
    print("❌ Failed to generate embedding")
    print(e)