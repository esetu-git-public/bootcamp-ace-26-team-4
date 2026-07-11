from src.retrieval.dense_retriever import DenseRetriever


retriever = DenseRetriever()

results = retriever.retrieve(
    "What are the treatments for breast cancer?"
)


for r in results:
    print("\nSCORE:", r["score"])
    print(r["text"][:200])