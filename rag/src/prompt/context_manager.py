class ContextManager:

    def __init__(self, max_context_chars=12000):
        self.max_context_chars = max_context_chars

    def select_context(self, retrieved_chunks):

        selected_chunks = []
        current_size = 0

        for chunk in retrieved_chunks:

            chunk_size = len(chunk["text"])

            if current_size + chunk_size > self.max_context_chars:
                break

            selected_chunks.append(chunk)
            current_size += chunk_size

        return selected_chunks