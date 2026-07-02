import logging
from lxml import etree
from typing import List, Dict

logger = logging.getLogger(__name__)

def clean_and_extract_pmc_xml(xml_byte_string: bytes) -> List[Dict]:
    try:
        # recover=True is non-negotiable. NCBI XMLs occasionally have unescaped characters 
        # or malformed tags. Without this, the pipeline will crash on edge cases.
        parser = etree.XMLParser(recover=True, remove_blank_text=True)
        root = etree.fromstring(xml_byte_string, parser)

        if root is None:
            logger.error("LXML returned None. The payload is not valid XML.")
            return []
        
    except Exception as e:
        logger.error(f"LXML parsing failure: {e}")
        return []

    # 1. NUKE THE BLOAT (The Blacklist)
    tags_to_destroy = [
        'aff',           # University/hospital affiliations
        'author-notes',  # Contact info, equal contribution declarations
        'ack',           # Acknowledgments
        'funding-group', # Grant numbers
        'ref-list',      # The bibliography (massive semantic noise)
        'notes'          # Conflict of interest statements
    ]
    
    for tag in tags_to_destroy:
        for elem in root.xpath(f'.//{tag}'):
            if elem.getparent() is not None:
                elem.getparent().remove(elem)

    extracted_chunks = []
    # 2. EXTRACT THE SIGNAL (The Whitelist)

    # A. Extract the Article Title
    title_node = root.find('.//article-title')
    if title_node is not None:
        title_text = " ".join(title_node.itertext()).strip()
        if title_text:
            extracted_chunks.append({
                "section_name": "Title",
                "text": title_text,
                "contains_tabular_data": False
            })

    # B. Extract the Abstract
    abstract_node = root.find('.//abstract')
    if abstract_node is not None:
        # itertext() cleanly strips any remaining nested formatting tags (like <i> or <b>)
        abstract_text = " ".join(abstract_node.itertext()).strip()
        if len(abstract_text) > 30:
            extracted_chunks.append({
                "section_name": "Abstract",
                "text": abstract_text,
                "contains_tabular_data": False
            })

    # C. Extract the Body structurally
    body_node = root.find('.//body')
    if body_node is not None:
        # We iterate by <sec> (Section) to maintain structural metadata
        for sec in body_node.xpath('.//sec'):
            
            # Grab the section title (e.g., "Methods", "Results")
            sec_title_node = sec.find('title')
            sec_title = sec_title_node.text if sec_title_node is not None and sec_title_node.text else "Unnamed Section"
            
            # Iterate by <p> (Paragraph) to establish natural chunk boundaries
            for p in sec.xpath('.//p'):
                para_text = " ".join(p.itertext()).strip()
                
                # Filter out layout artifacts and single-word anomalies (< 50 chars)
                if len(para_text) > 50:
                    extracted_chunks.append({
                        "section_name": sec_title,
                        "text": para_text,
                        "contains_tabular_data": False
                    })

    return extracted_chunks