class EvidenceStrength:

    def calculate(self, evidence):

        summary = evidence["summary"]

        score = summary["average_retrieval_score"]

        if score >= 0.90:
            level = "Very High"
        elif score >= 0.80:
            level = "High"
        elif score >= 0.70:
            level = "Moderate"
        else:
            level = "Low"

        return {
            "score": score,
            "level": level
        }