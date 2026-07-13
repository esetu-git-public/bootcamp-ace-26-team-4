from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)


class RagasEvaluator:

    def evaluate(
        self,
        question,
        answer,
        contexts,
        ground_truth,
    ):

        dataset = Dataset.from_dict({

            "question": [question],

            "answer": [answer],

            "contexts": [contexts],

            "ground_truth": [ground_truth]

        })

        result = evaluate(

            dataset,

            metrics=[

                faithfulness,

                answer_relevancy,

                context_precision,

                context_recall

            ]

        )

        return result