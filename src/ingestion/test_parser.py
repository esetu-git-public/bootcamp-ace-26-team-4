import requests
import logging
from parser import clean_and_extract_pmc_xml

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def test_parser_with_live_data(pmc_id: str):
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id={pmc_id}&retmode=xml"
    
    logger.info(f"Fetching XML for PMC ID: {pmc_id} from NCBI...")
    
    # NCBI requires a custom User-Agent, otherwise they silently block you or return errors
    headers = {
        "User-Agent": "MedicalRagPipeline/1.0 (mailto:test@example.com)"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status() 
    except requests.exceptions.RequestException as e:
        logger.critical(f"Network failure: {e}")
        return

    logger.info("Successfully downloaded payload. Passing to lxml parser...")
    
    chunks = clean_and_extract_pmc_xml(response.content)
    
    if not chunks:
        logger.error("Parser returned 0 chunks.")
        # Print the first 500 characters of the response so we can see the API error
        logger.error(f"NCBI Raw Response Preview:\n{response.text[:500]}")
        return

    logger.info(f"Parser successfully extracted {len(chunks)} clean semantic chunks.")
    
    print("\n--- FIRST 3 EXTRACTED CHUNKS ---")
    for i, chunk in enumerate(chunks[:3]):
        print(f"\n[Chunk {i+1}] Section: {chunk['section_name']}")
        text_preview = chunk['text'][:200] + "..." if len(chunk['text']) > 200 else chunk['text']
        print(f"Text Preview: {text_preview}")
    print("\n--------------------------------")

if __name__ == "__main__":
    test_parser_with_live_data("8436376")