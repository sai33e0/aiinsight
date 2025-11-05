from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime, timezone

from app.core.database import Base
from app.core.security import get_password_hash


class UserRole(enum.Enum):
    """User role enumeration."""
    ADMIN = "admin"
    USER = "user"
    API_USER = "api_user"


class SubscriptionPlan(enum.Enum):
    """Subscription plan enumeration."""
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class User(Base):
    """User model."""

    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)  # Nullable for API users
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)

    # Usage tracking
    requests_count = Column(Integer, default=0, nullable=False)
    tokens_used = Column(Integer, default=0, nullable=False)

    # Subscription
    subscription_plan = Column(SQLEnum(SubscriptionPlan), default=SubscriptionPlan.FREE, nullable=False)
    subscription_expires_at = Column(DateTime(timezone=True), nullable=True)

    # API keys for external access
    api_key = Column(String(255), unique=True, index=True, nullable=True)
    api_key_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Password reset
    password_reset_token = Column(String(255), nullable=True)
    password_reset_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Last activity tracking
    last_active_at = Column(DateTime(timezone=True), nullable=True)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"

    @classmethod
    def create_with_password(cls, email: str, name: str, password: str, **kwargs):
        """Create user with hashed password."""
        hashed_password = get_password_hash(password)
        return cls(
            email=email,
            name=name,
            hashed_password=hashed_password,
            **kwargs
        )

    @classmethod
    def create_api_user(cls, email: str, name: str, api_key: str, **kwargs):
        """Create API user without password."""
        return cls(
            email=email,
            name=name,
            api_key=api_key,
            hashed_password=None,
            role=UserRole.API_USER,
            **kwargs
        )

    def update_last_activity(self):
        """Update last activity timestamp."""
        from datetime import datetime, timezone
        self.last_active_at = datetime.now(timezone.utc)

    def increment_requests(self):
        """Increment request count."""
        self.requests_count += 1

    def add_tokens_used(self, tokens: int):
        """Add to tokens used count."""
        self.tokens_used += tokens

    def is_subscription_active(self):
        """Check if subscription is active."""
        if self.subscription_plan == SubscriptionPlan.FREE:
            return True
        return (
            self.subscription_expires_at is None or
            self.subscription_expires_at > datetime.now(timezone.utc)
        )

    def can_access_feature(self, feature: str) -> bool:
        """Check if user can access a specific feature based on subscription."""
        feature_limits = {
            SubscriptionPlan.FREE: {
                "max_documents": 10,
                "max_requests_per_day": 50,
                "max_tokens_per_month": 10000,
                "features": ["basic_chat", "document_upload"]
            },
            SubscriptionPlan.PRO: {
                "max_documents": 100,
                "max_requests_per_day": 500,
                "max_tokens_per_month": 100000,
                "features": ["basic_chat", "document_upload", "advanced_search", "analytics"]
            },
            SubscriptionPlan.ENTERPRISE: {
                "max_documents": -1,  # Unlimited
                "max_requests_per_day": -1,  # Unlimited
                "max_tokens_per_month": -1,  # Unlimited
                "features": ["basic_chat", "document_upload", "advanced_search", "analytics", "api_access", "team_features"]
            }
        }

        user_limits = feature_limits.get(self.subscription_plan, feature_limits[SubscriptionPlan.FREE])
        return feature in user_limits["features"]

    def to_dict(self, include_sensitive: bool = False):
        """Convert user to dictionary."""
        data = super().to_dict()
        if not include_sensitive:
            # Remove sensitive fields
            data.pop("hashed_password", None)
            data.pop("api_key", None)
            data.pop("password_reset_token", None)
        return data