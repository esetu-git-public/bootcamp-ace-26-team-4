class ResponseValidator:

    MIN_RESPONSE_LENGTH = 20
    MAX_RESPONSE_LENGTH = 15000

    INVALID_RESPONSES = {
        "",
        "none",
        "null",
        "n/a",
        "undefined"
    }

    HALLUCINATION_WARNING = (
        "I couldn't find sufficient evidence in the retrieved medical literature."
    )

    # ----------------------------------------------------------

    @classmethod
    def validate_answer(cls, answer: str):

        if answer is None:
            raise ValueError("LLM returned None.")

        if not isinstance(answer, str):
            raise TypeError("LLM response must be a string.")

        answer = answer.strip()

        if answer.lower() in cls.INVALID_RESPONSES:
            raise ValueError("LLM returned an invalid response.")

        if len(answer) < cls.MIN_RESPONSE_LENGTH:
            raise ValueError("Response is too short.")

        if len(answer) > cls.MAX_RESPONSE_LENGTH:
            raise ValueError("Response exceeds maximum allowed length.")

        return True

    # ----------------------------------------------------------

    @staticmethod
    def validate_references(references):

        if references is None:
            raise ValueError("References cannot be None.")

        if not isinstance(references, list):
            raise TypeError("References must be a list.")

        return True

    # ----------------------------------------------------------

    @staticmethod
    def calculate_confidence(retrieved_chunks):

        """
        Calculates average RRF score.
        """

        if not retrieved_chunks:
            return 0.0

        total = 0

        count = 0

        for chunk in retrieved_chunks:

            if "rrf_score" in chunk:

                total += chunk["rrf_score"]

                count += 1

        if count == 0:
            return 0.0

        return round(total / count, 4)

    # ----------------------------------------------------------

    @staticmethod
    def confidence_level(score):

        if score >= 0.03:
            return "High"

        if score >= 0.015:
            return "Medium"

        return "Low"

    # ----------------------------------------------------------

    @classmethod
    def validate(
        cls,
        answer,
        references,
        retrieved_chunks
    ):

        cls.validate_answer(answer)

        cls.validate_references(references)

        confidence = cls.calculate_confidence(
            retrieved_chunks
        )

        return {

            "valid": True,

            "confidence_score": confidence,

            "confidence_level": cls.confidence_level(
                confidence
            )

        }