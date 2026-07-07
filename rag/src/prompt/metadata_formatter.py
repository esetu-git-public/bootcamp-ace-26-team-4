class MetadataFormatter:

    @staticmethod
    def format_chunk(chunk, index):

        metadata = chunk["metadata"]

        return f"""
==========================================
Paper {index}

Title:
{metadata.get("title","Unknown")}

Journal:
{metadata.get("journal","Unknown")}

Publication Year:
{metadata.get("publication_year","Unknown")}

PMC ID:
{metadata.get("pmc_id","Unknown")}

Content:

{chunk["text"]}

==========================================
"""