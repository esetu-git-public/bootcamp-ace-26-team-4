import os
from pathlib import Path
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue


load_dotenv()


class UploadDeletionManager:
    """Handles deletion of uploaded documents and their chunks from Qdrant."""

    COLLECTION_NAME = "user_uploads"

    def __init__(self):
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )
        self.collection_name = self.COLLECTION_NAME

    def delete_by_filename(self, filename: str) -> dict:
        """
        Delete a file from disk and all its associated chunks from Qdrant.

        Args:
            filename: The name of the file (e.g., 'Heart_Attack.pdf')

        Returns:
            dict with deletion status and counts
        """
        # Step 1: Delete from disk
        file_path = Path("rag/data/uploads") / filename
        deleted_from_disk = False
        disk_message = None

        if file_path.exists():
            try:
                file_path.unlink()
                deleted_from_disk = True
                disk_message = f"File {filename} deleted from disk."
            except Exception as e:
                disk_message = f"Error deleting file from disk: {str(e)}"
        else:
            disk_message = f"File {filename} not found on disk."

        # Step 2: Delete chunks from Qdrant by filename filter
        chunks_deleted = 0
        qdrant_message = None

        try:
            # Create a filter to match all points with the given filename
            delete_filter = Filter(
                must=[
                    FieldCondition(
                        key="filename",
                        match=MatchValue(value=filename)
                    )
                ]
            )

            # Delete matching points
            delete_result = self.client.delete(
                collection_name=self.collection_name,
                points_selector=delete_filter
            )

            chunks_deleted = delete_result if isinstance(delete_result, int) else 0
            qdrant_message = f"Deleted {chunks_deleted} chunks from Qdrant collection '{self.collection_name}'."

        except Exception as e:
            qdrant_message = f"Error deleting chunks from Qdrant: {str(e)}"

        return {
            "filename": filename,
            "deleted_from_disk": deleted_from_disk,
            "disk_message": disk_message,
            "chunks_deleted": chunks_deleted,
            "qdrant_message": qdrant_message,
            "success": deleted_from_disk or chunks_deleted > 0
        }

    def list_uploaded_files(self) -> list:
        """List all files currently in the uploads directory."""
        upload_dir = Path("rag/data/uploads")
        if not upload_dir.exists():
            return []

        files = []
        for file_path in upload_dir.iterdir():
            if file_path.is_file():
                files.append({
                    "filename": file_path.name,
                    "size": file_path.stat().st_size,
                    "last_modified": file_path.stat().st_mtime
                })
        return files
