import re


class ClaimMapper:
    """Maps answer statements to evidence using meaningful token overlap.

    This is an attribution aid, not proof that a source entails a claim.
    """

    STOP_WORDS = {
        "about", "after", "among", "based", "clinical", "conclusion",
        "evidence", "findings", "from", "have", "however", "important",
        "paper", "papers", "research", "should", "study", "studies",
        "that", "their", "there", "these", "this", "with", "were",
    }

    @classmethod
    def _terms(cls, text):
        return {
            word for word in re.findall(r"[a-zA-Z]{5,}", text.lower())
            if word not in cls.STOP_WORDS
        }

    def map_claims(self, answer, grouped_papers):
        mappings = []
        claims = [
            line.strip(" #-\t") for line in answer.splitlines()
            if len(line.strip(" #-\t")) >= 20
        ]

        for claim in claims:
            claim_terms = self._terms(claim)
            supporting_chunks = []
            if len(claim_terms) < 2:
                continue

            for paper in grouped_papers:
                for chunk in paper.get("chunks", []):
                    overlap = claim_terms & self._terms(chunk.get("text", ""))
                    if len(overlap) >= 2:
                        supporting_chunks.append({
                            "paper": paper.get("title", "Unknown"),
                            "chunk_id": chunk.get("chunk_id"),
                            "matched_terms": sorted(overlap),
                        })

            mappings.append({"claim": claim, "supports": supporting_chunks})

        return mappings
