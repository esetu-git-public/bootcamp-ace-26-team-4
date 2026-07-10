from rag.src.routing.intent_classifier import IntentClassifier


class QueryRouter:
    """
    Routes a user query to the appropriate retrieval pipeline.

    This class DOES NOT perform retrieval.
    It only decides WHERE the query should go.
    """

    def __init__(self):
        self.classifier = IntentClassifier()

    def route(self, query: str) -> dict:
        """
        Returns a routing decision.

        Example:
        {
            "intent": "uploaded_document",
            "route": "upload",
            "filename": "medical.pdf",
            "needs_uploaded_docs": True,
            "needs_medical_kb": False,
            "needs_both": False,
            "is_summary_request": True
        }
        """

        classification = self.classifier.classify(query)

        intent = classification["intent"]
        filename = classification["filename"]
        summary = classification["is_summary_request"]

        if intent == "medical_question":
            return {
                "intent": intent,
                "route": "medical",
                "filename": None,
                "needs_uploaded_docs": False,
                "needs_medical_kb": True,
                "needs_both": False,
                "is_summary_request": summary,
            }

        elif intent == "uploaded_document":
            return {
                "intent": intent,
                "route": "upload",
                "filename": filename,
                "needs_uploaded_docs": True,
                "needs_medical_kb": False,
                "needs_both": False,
                "is_summary_request": summary,
            }

        elif intent == "compare":
            return {
                "intent": intent,
                "route": "both",
                "filename": filename,
                "needs_uploaded_docs": True,
                "needs_medical_kb": True,
                "needs_both": True,
                "is_summary_request": summary,
            }

        else:
            return {
                "intent": "general_chat",
                "route": "chat",
                "filename": None,
                "needs_uploaded_docs": False,
                "needs_medical_kb": False,
                "needs_both": False,
                "is_summary_request": False,
            }