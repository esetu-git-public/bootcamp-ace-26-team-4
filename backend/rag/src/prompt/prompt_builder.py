from rag.src.prompt.templates import (
    CHAT_TEMPLATE,
    SUMMARY_TEMPLATE,
    COMPARE_TEMPLATE,
)


class PromptBuilder:
    """
    Builds prompts for the Medical Research AI Assistant.
    """

    MAX_CONTEXT_CHARS = 36_000

    def __init__(self):

        self.templates = {
            "chat": CHAT_TEMPLATE,
            "summary": SUMMARY_TEMPLATE,
            "compare": COMPARE_TEMPLATE,
        }

    # ----------------------------------------------------------
    # Validate Template
    # ----------------------------------------------------------

    def _validate_template(self, template: str):

        if template not in self.templates:

            raise ValueError(
                f"Unsupported template '{template}'. "
                f"Available templates: {list(self.templates.keys())}"
            )

    # ----------------------------------------------------------
    # Build Context
    # ----------------------------------------------------------

    def _build_context(self, grouped_papers):

        context_sections = []
        context_length = 0

        for index, paper in enumerate(grouped_papers, start=1):

            section = []

            section.append("=" * 90)
            section.append(f"PAPER {index}")
            section.append("=" * 90)

            section.append(
                f"Title: {paper.get('title', 'Unknown')}"
            )

            section.append(
                f"Authors: {paper.get('authors', 'Unknown')}"
            )

            section.append(
                f"Journal: {paper.get('journal', 'Unknown')}"
            )

            section.append(
                f"Year: {paper.get('year', 'Unknown')}"
            )

            section.append(
                f"Study Type: {paper.get('study_type', 'Unknown')}"
            )

            section.append(
                f"Paper ID: {paper.get('paper_id', 'Unknown')}"
            )

            section.append(
                f"Retrieval Score: {paper.get('retrieval_score', 0):.4f}"
            )

            section.append("")
            section.append("Evidence")
            section.append("")

            for evidence_index, chunk in enumerate(
                paper.get("chunks", []),
                start=1,
            ):

                section.append(
                    f"[Evidence {evidence_index}]"
                )

                section.append(
                    chunk.get("text", "")
                )

                section.append("")

            section.append("-" * 90)

            rendered_section = "\n".join(section)
            separator_length = 2 if context_sections else 0
            remaining = self.MAX_CONTEXT_CHARS - context_length - separator_length

            if remaining <= 0:
                break

            if len(rendered_section) > remaining:
                truncation_notice = "\n\n[Additional retrieved evidence omitted for context limit.]"
                rendered_section = (
                    rendered_section[:max(0, remaining - len(truncation_notice))]
                    + truncation_notice
                )
                context_sections.append(rendered_section)
                break

            context_sections.append(rendered_section)
            context_length += len(rendered_section) + separator_length

        return "\n\n".join(context_sections)

    # ----------------------------------------------------------
    # Build Contradictions Section
    # ----------------------------------------------------------

    def _build_contradictions_section(self, contradictions):
        """
        Builds a formatted string of contradictions for the prompt.
        
        Args:
            contradictions: List of contradiction dictionaries
            
        Returns:
            Formatted string describing contradictions, or "None detected" if empty
        """
        if not contradictions:
            return "No contradictions detected among the retrieved papers."

        sections = []
        
        for idx, contradiction in enumerate(contradictions, start=1):
            section = []
            section.append(f"[Contradiction {idx}]")
            section.append(f"Description: {contradiction.get('description', 'Unknown contradiction')}")
            section.append(f"Papers involved: {contradiction.get('papers', [])}")
            section.append(f"Confidence: {contradiction.get('confidence', 0.0):.2f}")
            section.append(f"Severity: {contradiction.get('severity', 'unknown')}")
            
            # Add supporting details if available
            if 'supporting_evidence' in contradiction:
                section.append("Supporting evidence:")
                for evidence in contradiction.get('supporting_evidence', []):
                    section.append(f"  - {evidence}")
            
            if 'resolution_hint' in contradiction:
                section.append(f"Resolution hint: {contradiction.get('resolution_hint')}")
            
            sections.append("\n".join(section))
        
        return "\n\n".join(sections)

    # ----------------------------------------------------------
    # Generic Prompt Builder
    # ----------------------------------------------------------

    def build_prompt(
        self,
        question: str,
        evidence: dict,
        template: str = "chat",
    ) -> str:

        self._validate_template(template)

        context = self._build_context(
            evidence["papers"]
        )

        contradictions_text = self._build_contradictions_section(
            evidence.get("contradictions", [])
        )

        return self.templates[template].format(
            context=context,
            question=question,
            contradictions=contradictions_text,
        )

    # ----------------------------------------------------------
    # Chat Prompt
    # ----------------------------------------------------------

    def build_chat_prompt(
        self,
        question,
        evidence,
    ):

        return self.build_prompt(
            question=question,
            evidence=evidence,
            template="chat",
        )

    # ----------------------------------------------------------
    # Summary Prompt
    # ----------------------------------------------------------

    def build_summary_prompt(
        self,
        evidence,
    ):

        return self.build_prompt(
            question="",
            evidence=evidence,
            template="summary",
        )

    # ----------------------------------------------------------
    # Compare Prompt
    # ----------------------------------------------------------

    def build_compare_prompt(
        self,
        evidence,
    ):

        return self.build_prompt(
            question="",
            evidence=evidence,
            template="compare",
        )

    # ----------------------------------------------------------
    # Available Templates
    # ----------------------------------------------------------

    def available_templates(self):

        return list(self.templates.keys())
