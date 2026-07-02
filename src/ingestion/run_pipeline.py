import os
import json
import logging
from pathlib import Path
from parser import clean_and_extract_pmc_xml
from vectorizer import MedicalVectorizer

# Set up clean, professional logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def run_local_pipeline(input_dir: str, output_file: str, batch_size: int = 10):
    """
    Executes the local ingestion MVP.
    Reads raw XMLs -> Parses text -> Generates vectors -> Saves to a consolidated JSON.
    """
    input_path = Path(input_dir)
    output_path = Path(output_file)

    if not input_path.exists() or not input_path.is_dir():
        logger.critical(f"Input directory does not exist: {input_path.resolve()}")
        return

    # Ensure the output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    logger.info("Pipeline started.")
    
    # Initialize your local embedding engine
    vectorizer = MedicalVectorizer()
    
    all_processed_chunks = []
    docs_processed = 0
    current_batch = []

    # Locate all XML files in the target directory
    xml_files = list(input_path.glob("*.xml"))
    total_files = len(xml_files)
    
    if total_files == 0:
        logger.warning(f"No XML files found in {input_path.resolve()}")
        return

    logger.info(f"Found {total_files} XML files to process.")

    for xml_file in xml_files:
        try:
            logger.info(f"Processing: {xml_file.name}")
            
            with open(xml_file, 'rb') as f:
                xml_content = f.read()
            
            # Step 1: Parse and sanitize the text
            chunks = clean_and_extract_pmc_xml(xml_content)
            
            if not chunks:
                logger.warning(f"Skipping {xml_file.name} - No valid chunks extracted.")
                continue

            # Inject document metadata to track the origin of the text
            for chunk in chunks:
                chunk["document_id"] = xml_file.stem
            
            current_batch.extend(chunks)
            docs_processed += 1

            # Step 2: Batch processing for vectorization
            if docs_processed % batch_size == 0 or docs_processed == total_files:
                logger.info(f"Reached batch threshold. Vectorizing {len(current_batch)} accumulated chunks...")
                
                # Generate real embeddings locally
                embedded_chunks = vectorizer.embed_chunks(current_batch)
                all_processed_chunks.extend(embedded_chunks)
                
                # Clear the batch from memory
                current_batch = []

        except Exception as e:
            logger.error(f"Error processing file {xml_file.name}: {e}")
            continue

    # Catch any remaining chunks if total_files wasn't perfectly divisible by batch_size
    if current_batch:
        logger.info(f"Vectorizing final remaining {len(current_batch)} chunks...")
        embedded_chunks = vectorizer.embed_chunks(current_batch)
        all_processed_chunks.extend(embedded_chunks)

    # Step 3: Write out to a local JSON file to verify the data structure
    logger.info(f"Writing {len(all_processed_chunks)} total embedded chunks to local storage...")
    with open(output_path, 'w', encoding='utf-8') as out_f:
        json.dump(all_processed_chunks, out_f, indent=2, ensure_ascii=False)

    logger.info(f"Pipeline executed successfully. Output saved to {output_path.resolve()}")

if __name__ == "__main__":
    # Relative paths mapping to your structural architecture
    INPUT_DIRECTORY = "../../data/raw_xmls"
    OUTPUT_FILE = "../../data/processed_chunks.json"
    
    # Process files in batches of 5 documents at a time for local testing
    run_local_pipeline(INPUT_DIRECTORY, OUTPUT_FILE, batch_size=5)