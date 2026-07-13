import json
import os
import time

from rag.src.response.response_generator import ResponseGenerator
from rag.evaluation.metrics import Metrics


class EvaluationPausedError(RuntimeError):
    """Expected stop when the model provider cannot accept more requests."""


class Evaluator:

    def __init__(self):

        self.generator = ResponseGenerator()

    def evaluate(self, test_file, results_file=None, delay_seconds=8, test_ids=None, limit=None, rephrase=False):
        """Run the benchmark safely against a rate-limited LLM API.

        A checkpoint is written after every completed question.  Re-running
        the evaluation therefore continues from the first unanswered test
        instead of spending Gemini quota on questions that already ran.

        Additional optional args:
        - test_ids: iterable of test id strings to restrict which tests run.
        - limit: integer limit of how many pending tests to run (after filtering).
        - rephrase: if True, rephrase simple lookup questions to include the
          article name in the question to improve retrieval.
        """

        with open(test_file, "r", encoding="utf-8") as f:
            tests = json.load(f)

        results_file = results_file or os.path.join(
            os.path.dirname(test_file),
            "evaluation_results.json",
        )
        results = self._load_checkpoint(results_file)
        completed_ids = {result["id"] for result in results}

        # Start with tests that haven't completed yet
        pending_tests = [test for test in tests if test["id"] not in completed_ids]

        # If a whitelist of test_ids is provided, keep only those (preserve order)
        if test_ids:
            test_ids_set = set(test_ids)
            pending_tests = [t for t in pending_tests if t["id"] in test_ids_set]

        # Apply an optional limit
        if limit is not None:
            try:
                limit_val = int(limit)
                pending_tests = pending_tests[:limit_val]
            except Exception:
                pass

        for position, test in enumerate(pending_tests, start=1):

            print(
                f"\n[{position}/{len(pending_tests)}] Evaluating: {test['id']}"
            )

            # Optionally rephrase the question to include article metadata
            # when that helps the retriever find the correct document.
            original_question = test.get("question", "")
            question_text = original_question

            if rephrase:
                article_name = test.get("article")
                qlow = original_question.lower()
                if article_name and ("title" in qlow or "full title" in qlow):
                    question_text = f"Provide the full title of the article: \"{article_name}\"."
                elif article_name and ("corresponding author" in qlow or "author" in qlow):
                    question_text = f"Provide the corresponding author and their email for the article: \"{article_name}\"."
                # If the rule above doesn't match, keep the original question_text

            try:
                response = self.generator.generate_answer(
                    question_text
                )
            except Exception as exc:
                # Do not discard the checkpoint when a free-tier daily quota
                # or an unexpected API failure interrupts the benchmark.
                self._write_checkpoint(results_file, results)
                raise EvaluationPausedError(
                    "Evaluation paused before completing "
                    f"'{test['id']}'. Completed results were saved to "
                    f"{results_file}. Run the command again after the Gemini "
                    "quota resets to resume."
                ) from exc

            relevant_chunks = test.get("relevant_chunks", [])

            # Compute retrieval metrics only when relevant chunk IDs are provided.
            precision = None
            recall = None
            retrieval_score = None

            if relevant_chunks:
                precision = Metrics.precision_at_k(
                    response["references"],
                    relevant_chunks
                )

                recall = Metrics.recall_at_k(
                    response["references"],
                    relevant_chunks
                )

                retrieval_score = Metrics.retrieval_f1(precision, recall)

            # ----------------------------------------------------
            # Answer correctness checks
            #  - keyword_recall: fraction of expected keywords present
            #  - semantic similarity: embedding-based similarity to reference
            #  - answer_score: weighted combination (semantic + keyword)
            # ----------------------------------------------------

            answer_text = response["answer"] or ""
            answer = answer_text.lower()

            keywords = test.get("answer_keywords", [])
            keyword_recall = None

            if keywords:
                matched = sum(
                    keyword.lower() in answer
                    for keyword in keywords
                )
                keyword_recall = matched / len(keywords)

            reference_answer = test.get("reference_answer") or ""
            semantic_similarity = None

            if reference_answer:
                semantic_similarity = Metrics.answer_semantic_similarity(
                    answer_text,
                    reference_answer,
                )

            # Combine semantic similarity and keyword evidence into a single
            # answer score. Prefer semantic similarity when available.
            answer_score = None

            if semantic_similarity is not None:
                if keyword_recall is not None:
                    # Weighted: 75% semantic similarity, 25% keyword recall
                    answer_score = 0.75 * semantic_similarity + 0.25 * keyword_recall
                else:
                    answer_score = semantic_similarity
            else:
                # Fall back to keyword-only scoring when embeddings unavailable
                answer_score = keyword_recall

            # Final score: combine retrieval and answer scores with a bias
            # towards answer correctness (60% answer, 40% retrieval).
            final_score = None
            if retrieval_score is not None and answer_score is not None:
                final_score = 0.4 * retrieval_score + 0.6 * answer_score
            elif answer_score is not None:
                final_score = answer_score
            elif retrieval_score is not None:
                final_score = retrieval_score

            # Record detailed results for transparency
            results.append({

                "id": test["id"],

                "question": test["question"],

                "reference_answer": reference_answer,

                "keyword_recall": keyword_recall,

                "precision": precision,

                "recall": recall,

                "retrieval_score": retrieval_score,

                "semantic_similarity": semantic_similarity,

                "answer_score": answer_score,

                "final_score": final_score,

            })

            self._write_checkpoint(results_file, results)

            # A small, deliberate gap avoids burst RPM limits on Gemini's
            # free tier.  It is skipped after the last pending question.
            if position < len(pending_tests) and delay_seconds > 0:
                print(f"Waiting {delay_seconds}s before the next request...")
                time.sleep(delay_seconds)

        return results

    @staticmethod
    def _load_checkpoint(results_file):
        if not os.path.exists(results_file):
            return []

        with open(results_file, "r", encoding="utf-8") as file:
            saved = json.load(file)

        if not isinstance(saved, list):
            raise ValueError(f"Invalid evaluation checkpoint: {results_file}")

        print(f"Resuming with {len(saved)} completed result(s).")
        return saved

    @staticmethod
    def _write_checkpoint(results_file, results):
        temporary_file = f"{results_file}.tmp"

        with open(temporary_file, "w", encoding="utf-8") as file:
            json.dump(results, file, indent=2, ensure_ascii=False)

        os.replace(temporary_file, results_file)
