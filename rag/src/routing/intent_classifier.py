import re


class IntentClassifier:
    """
    Classifies user queries into routing intents.

    Intents:
        - medical_question
        - uploaded_document
        - compare
        - general_chat
    """

    GREETINGS = {
        "hi",
        "hello",
        "hey",
        "hii",
        "good morning",
        "good afternoon",
        "good evening",
        "thanks",
        "thank you",
    }

    COMPARE_KEYWORDS = [
        "compare",
        "difference",
        "versus",
        "vs",
        "against",
    ]

    UPLOAD_KEYWORDS = [
        "uploaded",
        "upload",
        "document",
        "file",
        "paper",
        "pdf",
        "doc",
        "docx",
        "txt",
        "xml",
        "this pdf",
        "this file",
        "this document",
        "uploaded pdf",
        "uploaded paper",
        "uploaded document",
    ]

    SUMMARY_KEYWORDS = [
        "summarize",
        "summary",
        "overview",
        "tldr",
        "explain",
        "describe",
        "what is inside",
        "what does",
        "contains",
        "content",
    ]

    FILE_PATTERN = re.compile(
        r"([A-Za-z0-9_-]+\.(?:pdf|docx|txt|xml|md|csv))",
        re.IGNORECASE,
    )

    def classify(self, query: str) -> dict:

        text = query.strip().lower()

        filename = self.extract_filename(query)

        is_summary = self.is_summary_request(text)

        if text in self.GREETINGS:
            intent = "general_chat"

        elif self.contains_compare(text):
            intent = "compare"

        elif filename is not None or self.references_uploaded_document(text):
            intent = "uploaded_document"

        else:
            intent = "medical_question"

        return {
            "intent": intent,
            "filename": filename,
            "is_summary_request": is_summary,
        }

    def extract_filename(self, query: str):

        match = self.FILE_PATTERN.search(query)

        if match:
            return match.group(1)

        return None

    def references_uploaded_document(self, text: str):

        for keyword in self.UPLOAD_KEYWORDS:
            if keyword in text:
                return True

        return False

    def contains_compare(self, text: str):

        for keyword in self.COMPARE_KEYWORDS:
            if keyword in text:
                return True

        return False

    def is_summary_request(self, text: str):

        for keyword in self.SUMMARY_KEYWORDS:
            if keyword in text:
                return True

        return False