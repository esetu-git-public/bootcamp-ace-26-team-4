import os
from pprint import pprint

from rag.evaluation.evaluator import EvaluationPausedError, Evaluator


def main():

    evaluator = Evaluator()

    # Allow controlling which tests to run via environment variables to save quota:
    # - EVALUATION_TEST_IDS: comma-separated test ids to run (e.g. 'heart_attack_01,heart_attack_02')
    # - EVALUATION_LIMIT: an integer limit to how many pending tests to run (e.g. '2')
    # - EVALUATION_REPHRASE: if '1' or 'true', rephrase questions to include the article name.

    test_ids_env = os.getenv("EVALUATION_TEST_IDS")
    test_ids = [tid.strip() for tid in test_ids_env.split(",")] if test_ids_env else None

    limit = os.getenv("EVALUATION_LIMIT")

    rephrase_flag = os.getenv("EVALUATION_REPHRASE", "0").lower() in ("1", "true", "yes")

    try:
        results = evaluator.evaluate(
            "rag/evaluation/test_questions.json",
            results_file="rag/evaluation/evaluation_results.json",
            # Override with EVALUATION_REQUEST_DELAY_SECONDS when required.
            delay_seconds=float(
                os.getenv("EVALUATION_REQUEST_DELAY_SECONDS", "8")
            ),
            test_ids=test_ids,
            limit=limit,
            rephrase=rephrase_flag,
        )
    except EvaluationPausedError as exc:
        print("\n===== EVALUATION PAUSED =====")
        print(exc)
        return

    print("\n===== EVALUATION RESULTS =====\n")

    precision_scores = []
    recall_scores = []
    retrieval_scores = []
    keyword_scores = []
    semantic_scores = []
    answer_scores = []
    final_scores = []

    for result in results:

        pprint(result)

        if result.get("precision") is not None:
            precision_scores.append(result["precision"])
        if result.get("recall") is not None:
            recall_scores.append(result["recall"])
        if result.get("retrieval_score") is not None:
            retrieval_scores.append(result["retrieval_score"])
        if result.get("keyword_recall") is not None:
            keyword_scores.append(result["keyword_recall"])
        if result.get("semantic_similarity") is not None:
            semantic_scores.append(result["semantic_similarity"])
        if result.get("answer_score") is not None:
            answer_scores.append(result["answer_score"])
        if result.get("final_score") is not None:
            final_scores.append(result["final_score"])

    print("\n===== SUMMARY =====")

    if precision_scores:
        print(
            f"Average Precision@K: "
            f"{sum(precision_scores) / len(precision_scores):.3f}"
        )

    if recall_scores:
        print(
            f"Average Recall@K: "
            f"{sum(recall_scores) / len(recall_scores):.3f}"
        )

    if retrieval_scores:
        print(
            f"Average Retrieval F1: "
            f"{sum(retrieval_scores) / len(retrieval_scores):.3f}"
        )

    if keyword_scores:
        print(
            f"Average Answer Keyword Recall: "
            f"{sum(keyword_scores) / len(keyword_scores):.3f}"
        )

    if semantic_scores:
        print(
            f"Average Semantic Similarity (answer vs. reference): "
            f"{sum(semantic_scores) / len(semantic_scores):.3f}"
        )

    if answer_scores:
        print(
            f"Average Answer Score (combined): "
            f"{sum(answer_scores) / len(answer_scores):.3f}"
        )

    if final_scores:
        print(
            f"Average Final Score (retrieval/answer combined): "
            f"{sum(final_scores) / len(final_scores):.3f}"
        )


if __name__ == "__main__":
    main()
