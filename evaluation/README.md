# Evaluation of Retrieval-Augmented Generation (RAG) in Medical Applications

This document summarizes key evaluation techniques and considerations for RAG systems applied to medical text and decision support.

## Core evaluation metrics

- Accuracy / Exact Match: correctness of discrete answers (e.g., diagnoses, codes).
- Precision, Recall, F1: for extraction and classification tasks.
- ROUGE / BLEU: for view of text overlap when comparing generated summaries to references (use cautiously).
- Semantic similarity: embedding-based cosine similarity to assess meaning-level match.

## Retrieval-specific metrics

- Recall@k / Precision@k: fraction of relevant documents found in top-k retrieved passages.
- Mean Reciprocal Rank (MRR): rank quality of the first relevant result.
- Retrieval latency and throughput: performance constraints for clinical settings.

## Faithfulness and hallucination

- Factuality checks: verify generated claims against retrieved sources and trusted knowledge-bases.
- Hallucination rate: proportion of assertions that lack grounding in provided evidence.
- Attribution accuracy: correctness of source citations and provenance.

## Safety, clinical validity, and risk metrics

- Clinical appropriateness: expert review for safety and adherence to standards.
- Harmful advice detection: measure frequency of unsafe or contraindicated recommendations.
- Calibration / confidence: reliability of model confidence scores for downstream triage.

## Human evaluation

- Expert clinicians review for helpfulness, accuracy, and potential harm.
- Annotation guidelines: structured rubrics (e.g., correctness, relevance, clarity, source grounding).
- Inter-annotator agreement (Cohen's Kappa) to measure label consistency.

## Dataset and benchmark considerations

- Use de-identified, ethically sourced clinical datasets and established benchmarks where possible.
- Split by patient/time to avoid leakage; evaluate on rare and edge cases.

## Automated pipelines and tooling

- Use automated unit tests for factual consistency (QA checks that cross-reference sources).
- Continuous evaluation: track metrics over deployments, with alerts for drift or rising hallucination.

## Privacy and compliance

- Ensure evaluations do not expose PHI; use synthetic or de-identified data.
- Log and access controls for any clinical data used in evaluation.

## Suggested evaluation workflow

1. Define clinical tasks and success criteria with domain experts.
2. Measure retrieval metrics and ensure high recall for evidence.
3. Evaluate generation for factuality, fluency, and clinical safety (automated + human).
4. Run stress tests on edge cases and adversarial prompts.
5. Monitor performance in production and iterate.

## References and further reading

- Literature on factuality and hallucination in LLMs, RAG systems, and clinical NLP evaluation best practices.

```markdown
