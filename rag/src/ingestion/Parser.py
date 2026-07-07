from pathlib import Path
import json
import xml.etree.ElementTree as ET


RAW_XML_DIR = Path(r"D:\clg\AIML\MRP\rag\data\raw\raw_xmls")
OUTPUT_PATH = Path(r"D:\clg\AIML\MRP\rag\data\processed\papers.jsonl")


def clean_text(text):
    if not text:
        return ""
    return " ".join(text.split())


def get_text(element):
    if element is None:
        return ""
    return clean_text(" ".join(element.itertext()))


def find_text(root, path):
    element = root.find(path)
    return get_text(element)


def extract_pmc_id(root):
    for article_id in root.findall(".//article-id"):
        if article_id.attrib.get("pub-id-type") == "pmc":
            return clean_text(article_id.text)
    return ""


def extract_title(root):
    return find_text(root, ".//article-title")


def extract_abstract(root):
    abstracts = root.findall(".//abstract")
    return clean_text(" ".join(get_text(abs_el) for abs_el in abstracts))


def extract_journal(root):
    return find_text(root, ".//journal-title")


def extract_authors(root):
    authors = []

    for contrib in root.findall(".//contrib"):
        if contrib.attrib.get("contrib-type") != "author":
            continue

        surname = find_text(contrib, ".//surname")
        given_names = find_text(contrib, ".//given-names")

        full_name = clean_text(f"{given_names} {surname}")
        if full_name:
            authors.append(full_name)

    return authors


def extract_publication_year(root):
    for pub_date in root.findall(".//pub-date"):
        year = find_text(pub_date, ".//year")
        if year:
            return year
    return ""


def extract_body_text(root):
    body = root.find(".//body")
    return get_text(body)


def parse_xml_file(xml_path):
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()

        return {
            "pmc_id": extract_pmc_id(root),
            "title": extract_title(root),
            "abstract": extract_abstract(root),
            "body_text": extract_body_text(root),
            "journal": extract_journal(root),
            "authors": extract_authors(root),
            "publication_year": extract_publication_year(root),
            "source_file": xml_path.name,
        }

    except Exception as e:
        return {
            "error": str(e),
            "source_file": xml_path.name,
        }


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    xml_files = sorted(RAW_XML_DIR.glob("*.xml"))

    if not xml_files:
        print(f"No XML files found in: {RAW_XML_DIR}")
        return

    success_count = 0
    error_count = 0

    with OUTPUT_PATH.open("w", encoding="utf-8") as f:
        for xml_path in xml_files:
            paper = parse_xml_file(xml_path)

            if "error" in paper:
                error_count += 1
            else:
                success_count += 1

            f.write(json.dumps(paper, ensure_ascii=False) + "\n")

    print("Parsing completed")
    print(f"Total XML files: {len(xml_files)}")
    print(f"Successful: {success_count}")
    print(f"Errors: {error_count}")
    print(f"Output saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

# checking in the code to the repository
