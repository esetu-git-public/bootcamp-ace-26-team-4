import re


class ContradictionDetector:
    """Find only explicit, high-signal disagreement in retrieved evidence.

    A shared study type is not evidence of a contradiction, so this detector
    deliberately stays conservative.  It flags a pair only when one paper
    reports no effect and another reports an effect on overlapping terms.
    """

    NO_EFFECT = re.compile(r"\b(no significant|no effect|not associated|did not (?:improve|reduce|increase))\b", re.I)
    EFFECT = re.compile(r"\b(significant(?:ly)?|improved|reduced|increased|associated with)\b", re.I)

    @staticmethod
    def _text(paper):
        return " ".join(chunk.get("text", "") for chunk in paper.get("chunks", []))

    def detect(self, grouped_papers):
        contradictions = []

        for index, paper_a in enumerate(grouped_papers):
            text_a = self._text(paper_a)
            for paper_b in grouped_papers[index + 1:]:
                text_b = self._text(paper_b)
                a_no_effect = bool(self.NO_EFFECT.search(text_a))
                b_no_effect = bool(self.NO_EFFECT.search(text_b))
                a_effect = bool(self.EFFECT.search(text_a))
                b_effect = bool(self.EFFECT.search(text_b))

                if (a_no_effect and b_effect) or (b_no_effect and a_effect):
                    contradictions.append({
                        "description": "The retrieved excerpts contain conflicting effect signals; verify the study populations and outcomes.",
                        "papers": [paper_a.get("title", "Unknown"), paper_b.get("title", "Unknown")],
                        "confidence": 0.5,
                        "severity": "potential",
                    })

        return contradictions
