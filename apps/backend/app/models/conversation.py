from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Conversation(Base):
    """Conversation model."""

    __tablename__ = "conversations"

    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Conversation metadata
    title = Column(String(500), nullable=False, default="New Conversation")
    description = Column(Text, nullable=True)

    # Conversation statistics
    message_count = Column(Integer, default=0, nullable=False)
    total_tokens = Column(Integer, default=0, nullable=False)

    # Conversation context (stored as JSON for flexibility)
    context = Column(Text, nullable=True)  # Serialized context data

    # Conversation state
    is_active = Column(String(50), default="active", nullable=False)  # active, archived, deleted
    last_activity_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Conversation(id={self.id}, title={self.title}, user_id={self.user_id})>"

    @property
    def is_archived(self) -> bool:
        """Check if conversation is archived."""
        return self.is_active == "archived"

    @property
    def is_deleted(self) -> bool:
        """Check if conversation is deleted."""
        return self.is_active == "deleted"

    def update_activity(self):
        """Update last activity timestamp."""
        from datetime import datetime, timezone
        self.last_activity_at = datetime.now(timezone.utc)

    def increment_message_count(self):
        """Increment message count."""
        self.message_count += 1
        self.update_activity()

    def add_tokens(self, tokens: int):
        """Add to total tokens used."""
        if tokens > 0:
            self.total_tokens += tokens

    def archive(self):
        """Archive conversation."""
        self.is_active = "archived"

    def unarchive(self):
        """Unarchive conversation."""
        self.is_active = "active"

    def soft_delete(self):
        """Soft delete conversation."""
        self.is_active = "deleted"

    def restore(self):
        """Restore deleted conversation."""
        self.is_active = "active"

    def get_context_summary(self) -> str:
        """Get a summary of conversation context."""
        if not self.description:
            return f"Conversation with {self.message_count} messages"
        return self.description

    def to_dict(self):
        """Convert conversation to dictionary."""
        data = super().to_dict()
        # Include computed fields
        data["is_archived"] = self.is_archived
        data["is_deleted"] = self.is_deleted
        data["context_summary"] = self.get_context_summary()
        return data

    @classmethod
    def create_with_title(cls, user_id: int, title: str = None, **kwargs):
        """Create conversation with automatic title if not provided."""
        if not title:
            title = f"Conversation {cls.get_next_conversation_number(user_id)}"
        return cls(user_id=user_id, title=title, **kwargs)

    @classmethod
    def get_next_conversation_number(cls, user_id: int) -> int:
        """Get next conversation number for user (simplified)."""
        # This would typically involve a database query
        # For now, return a placeholder
        return 1