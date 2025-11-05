from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Enum as SQLEnum, Float
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class MessageRole(enum.Enum):
    """Message role enumeration."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Message(Base):
    """Message model."""

    __tablename__ = "messages"

    # Foreign key to conversation
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)

    # Message content
    role = Column(SQLEnum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    tokens = Column(Integer, nullable=True)

    # AI response metadata
    model_name = Column(String(100), nullable=True)  # e.g., "gpt-3.5-turbo"
    confidence_score = Column(Float, nullable=True)  # 0.0 to 1.0
    response_time_ms = Column(Integer, nullable=True)  # Response time in milliseconds

    # Source information for assistant messages
    sources = Column(JSON, nullable=True)  # Array of source documents and chunks

    # Message metadata
    metadata = Column(JSON, nullable=True)  # Additional message metadata

    # Feedback and ratings
    rating = Column(Integer, nullable=True)  # 1-5 star rating
    feedback = Column(Text, nullable=True)  # User feedback text
    feedback_at = Column(DateTime(timezone=True), nullable=True)

    # Processing information
    processing_error = Column(Text, nullable=True)
    is_streamed = Column(String(50), default="no", nullable=False)  # yes, no, partial

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")

    def __repr__(self):
        return f"<Message(id={self.id}, role={self.role}, conversation_id={self.conversation_id})>"

    @property
    def is_from_user(self) -> bool:
        """Check if message is from user."""
        return self.role == MessageRole.USER

    @property
    def is_from_assistant(self) -> bool:
        """Check if message is from assistant."""
        return self.role == MessageRole.ASSISTANT

    @property
    def is_system_message(self) -> bool:
        """Check if message is system message."""
        return self.role == MessageRole.SYSTEM

    @property
    def has_sources(self) -> bool:
        """Check if message has source citations."""
        return bool(self.sources)

    @property
    def has_feedback(self) -> bool:
        """Check if message has user feedback."""
        return self.rating is not None or self.feedback is not None

    def add_source(self, document_id: str, document_title: str, chunk_id: str,
                   content: str, relevance_score: float, page_number: int = None):
        """Add a source citation to the message."""
        if not self.sources:
            self.sources = []

        source = {
            "document_id": document_id,
            "document_title": document_title,
            "chunk_id": chunk_id,
            "content": content,
            "relevance_score": relevance_score
        }

        if page_number:
            source["page_number"] = page_number

        self.sources.append(source)

    def set_feedback(self, rating: int = None, feedback: str = None):
        """Set user feedback for the message."""
        from datetime import datetime, timezone

        if rating is not None:
            self.rating = max(1, min(5, rating))  # Ensure rating is 1-5

        if feedback:
            self.feedback = feedback

        if rating is not None or feedback:
            self.feedback_at = datetime.now(timezone.utc)

    def get_source_count(self) -> int:
        """Get number of sources cited."""
        return len(self.sources) if self.sources else 0

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
        """Convert message to dictionary."""
        data = super().to_dict()
        # Include computed properties
        data["is_from_user"] = self.is_from_user
        data["is_from_assistant"] = self.is_from_assistant
        data["has_sources"] = self.has_sources
        data["has_feedback"] = self.has_feedback
        data["source_count"] = self.get_source_count()
        return data

    @classmethod
    def create_user_message(cls, conversation_id: int, content: str, **kwargs):
        """Create a user message."""
        return cls(
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=content,
            **kwargs
        )

    @classmethod
    def create_assistant_message(cls, conversation_id: int, content: str,
                               model_name: str = None, tokens: int = None,
                               confidence_score: float = None, **kwargs):
        """Create an assistant message."""
        return cls(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=content,
            model_name=model_name,
            tokens=tokens,
            confidence_score=confidence_score,
            **kwargs
        )

    @classmethod
    def create_system_message(cls, conversation_id: int, content: str, **kwargs):
        """Create a system message."""
        return cls(
            conversation_id=conversation_id,
            role=MessageRole.SYSTEM,
            content=content,
            **kwargs
        )