from collections import Counter


class EvidenceAggregator:

    def aggregate(self, grouped_papers):

        study_types = Counter()
        journals = Counter()
        years = []

        total_score = 0

        for paper in grouped_papers:

            study_types[paper.get("study_type", "Unknown")] += 1
            journals[paper.get("journal", "Unknown")] += 1

            year = paper.get("year")
            if isinstance(year, int):
                years.append(year)

            total_score += paper.get("retrieval_score", 0)

        return {

            "summary": {

                "num_papers": len(grouped_papers),

                "study_types": dict(study_types),

                "journals": dict(journals),

                "latest_year": max(years) if years else None,

                "oldest_year": min(years) if years else None,

                "average_retrieval_score":
                    total_score / len(grouped_papers)
                    if grouped_papers else 0,
            },

            "papers": grouped_papers
        }