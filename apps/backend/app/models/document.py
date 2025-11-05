from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class DocumentStatus(enum.Enum):
    """Document processing status."""
    UPLOADING = "uploading"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Document(Base):
    """Document model."""

    __tablename__ = "documents"

    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Document metadata
    title = Column(String(500), nullable=False)
    original_filename = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_hash = Column(String(64), index=True, nullable=True)  # SHA-256 hash

    # Processing status
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.UPLOADING, nullable=False)
    processing_error = Column(Text, nullable=True)
    processing_progress = Column(Integer, default=0, nullable=False)  # 0-100

    # Content information
    content_preview = Column(Text, nullable=True)  # First 500 chars
    word_count = Column(Integer, default=0, nullable=False)
    page_count = Column(Integer, nullable=True)  # For PDFs

    # Vector store information
    vector_store_id = Column(String(255), nullable=True)
    chunk_count = Column(Integer, default=0, nullable=False)
    embedding_model = Column(String(100), nullable=True)

    # Document metadata (flexible JSON field)
    metadata = Column(JSON, nullable=True)

    # Processing timestamps
    processed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="documents")

    def __repr__(self):
        return f"<Document(id={self.id}, title={self.title}, status={self.status})>"

    @property
    def is_processed(self) -> bool:
        """Check if document has been processed."""
        return self.status == DocumentStatus.COMPLETED

    @property
    def is_failed(self) -> bool:
        """Check if document processing failed."""
        return self.status == DocumentStatus.FAILED

    @property
    def is_processing(self) -> bool:
        """Check if document is currently being processed."""
        return self.status == DocumentStatus.PROCESSING

    def update_progress(self, progress: int):
        """Update processing progress."""
        self.processing_progress = max(0, min(100, progress))
        if self.processing_progress >= 100:
            self.status = DocumentStatus.COMPLETED
            from datetime import datetime, timezone
            self.processed_at = datetime.now(timezone.utc)

    def mark_as_failed(self, error_message: str):
        """Mark document processing as failed."""
        self.status = DocumentStatus.FAILED
        self.processing_error = error_message
        from datetime import datetime, timezone
        self.processed_at = datetime.now(timezone.utc)

    def get_metadata_field(self, key: str, default=None):
        """Get a specific metadata field."""
        if not self.metadata:
            return default
        return self.metadata.get(key, default)

    def set_metadata_field(self, key: str, value):
        """Set a specific metadata field."""
        if not self.metadata:
            self.metadata = {}
        self.metadata[key] = value

    def to_dict(self):
        """Convert document to dictionary."""
        data = super().to_dict()
        # Include file size in human readable format
        data["file_size_mb"] = round(self.file_size / (1024 * 1024), 2)
        return data

    @classmethod
    def get_supported_mime_types(cls):
        """Get list of supported MIME types."""
        return [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "text/plain",
            "text/markdown",
            "text/html",
            "text/csv",
            "application/json",
            "application/xml",
            "text/xml"
        ]

    @classmethod
    def is_mime_type_supported(cls, mime_type: str) -> bool:
        """Check if MIME type is supported."""
        return mime_type in cls.get_supported_mime_types()

    def get_file_extension(self) -> str:
        """Get file extension from MIME type."""
        mime_to_extension = {
            "application/pdf": ".pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
            "application/msword": ".doc",
            "text/plain": ".txt",
            "text/markdown": ".md",
            "text/html": ".html",
            "text/csv": ".csv",
            "application/json": ".json",
            "application/xml": ".xml",
            "text/xml": ".xml"
        }
        return mime_to_extension.get(self.mime_type, "")