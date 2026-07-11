class MetadataFormatter:

    MAX_CHUNK_CHARS = 1200

    @staticmethod
    def _trim_text(text: str) -> str:
        if not text:
            return ""

        text = text.strip()

        if len(text) <= MetadataFormatter.MAX_CHUNK_CHARS:
            return text

        return text[:MetadataFormatter.MAX_CHUNK_CHARS].strip() + "\n...[TRUNCATED]"

    @staticmethod
    def format_chunk(chunk, index):

        metadata = chunk["metadata"]
        text = MetadataFormatter._trim_text(chunk["text"])

        return f"""
==========================================
Paper {index}

Title:
{metadata.get("title", "Unknown")}

Journal:
{metadata.get("journal", "Unknown")}

Publication Year:
{metadata.get("publication_year", "Unknown")}

PMC ID:
{metadata.get("pmc_id", "Unknown")}

Content:
{text}

==========================================
"""