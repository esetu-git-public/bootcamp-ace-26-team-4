class CitationGenerator:

    @staticmethod
    def generate(retrieved_chunks):

        references = []

        seen = set()

        for chunk in retrieved_chunks:

            metadata = chunk["metadata"]

            pmc_id = metadata.get("pmc_id")

            if pmc_id in seen:
                continue

            seen.add(pmc_id)

            references.append({

                "title": metadata.get(
                    "title",
                    "Unknown"
                ),

                "journal": metadata.get(
                    "journal",
                    "Unknown"
                ),

                "publication_year": metadata.get(
                    "publication_year",
                    "Unknown"
                ),

                "pmc_id": pmc_id,

                "source_file": metadata.get(
                    "source_file",
                    "Unknown"
                )

            })

        return references

    # -----------------------------------------------------

    @staticmethod
    def format(references):

        if not references:

            return "No references."

        output = []

        output.append("\nReferences\n")

        for i, ref in enumerate(

                references,

                start=1

        ):

            output.append(

f"""
[{i}]

Title:
{ref["title"]}

Journal:
{ref["journal"]}

Year:
{ref["publication_year"]}

PMC ID:
{ref["pmc_id"]}

Source:
{ref["source_file"]}
"""
            )

        return "\n".join(output)