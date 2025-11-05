from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple

from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserLogin
from app.core.security import (
    get_password_hash, verify_password, create_access_token,
    create_refresh_token, verify_token, generate_password_reset_token,
    verify_password_reset_token, generate_api_key
)
from app.core.exceptions import AuthenticationError, NotFoundError, ConflictError


class AuthService:
    """Authentication service."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, user_data: UserCreate) -> Tuple[User, str, str]:
        """Register a new user."""
        # Check if user already exists
        existing_user = await self.get_user_by_email(user_data.email)
        if existing_user:
            raise ConflictError("User with this email already exists")

        # Create new user
        user = User.create_with_password(
            email=user_data.email,
            name=user_data.name,
            password=user_data.password,
            role=UserRole(user_data.role.value) if user_data.role else UserRole.USER
        )

        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        # Generate tokens
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)

        return user, access_token, refresh_token

    async def login_user(self, login_data: UserLogin) -> Tuple[User, str, str]:
        """Authenticate user and return tokens."""
        user = await self.get_user_by_email(login_data.email)
        if not user or not user.hashed_password:
            raise AuthenticationError("Invalid email or password")

        if not verify_password(login_data.password, user.hashed_password):
            raise AuthenticationError("Invalid email or password")

        if not user.is_active:
            raise AuthenticationError("Account is deactivated")

        # Update last login
        user.last_login_at = datetime.now(timezone.utc)
        await self.db.commit()

        # Generate tokens
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)

        return user, access_token, refresh_token

    async def refresh_token(self, refresh_token: str) -> Tuple[str, str]:
        """Refresh access token using refresh token."""
        try:
            user_id = verify_token(refresh_token, token_type="refresh")
            user = await self.get_user_by_id(user_id)

            if not user or not user.is_active:
                raise AuthenticationError("Invalid refresh token")

            # Generate new tokens
            new_access_token = create_access_token(subject=user.id)
            new_refresh_token = create_refresh_token(subject=user.id)

            return new_access_token, new_refresh_token

        except Exception:
            raise AuthenticationError("Invalid refresh token")

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_user_by_api_key(self, api_key: str) -> Optional[User]:
        """Get user by API key."""
        result = await self.db.execute(
            select(User).where(User.api_key == api_key)
        )
        return result.scalar_one_or_none()

    async def update_user_activity(self, user_id: int) -> None:
        """Update user last activity timestamp."""
        user = await self.get_user_by_id(user_id)
        if user:
            user.update_last_activity()
            user.increment_requests()
            await self.db.commit()

    async def change_password(self, user_id: int, current_password: str, new_password: str) -> None:
        """Change user password."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")

        if not user.hashed_password:
            raise AuthenticationError("Cannot change password for API users")

        if not verify_password(current_password, user.hashed_password):
            raise AuthenticationError("Current password is incorrect")

        user.hashed_password = get_password_hash(new_password)
        await self.db.commit()

    async def request_password_reset(self, email: str) -> str:
        """Request password reset token."""
        user = await self.get_user_by_email(email)
        if not user:
            # Don't reveal that user doesn't exist
            return ""

        user.password_reset_token = generate_password_reset_token(email)
        user.password_reset_expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        await self.db.commit()

        return user.password_reset_token

    async def reset_password(self, token: str, new_password: str) -> None:
        """Reset password using reset token."""
        email = verify_password_reset_token(token)
        if not email:
            raise AuthenticationError("Invalid or expired reset token")

        user = await self.get_user_by_email(email)
        if not user:
            raise NotFoundError("User not found")

        if user.password_reset_token != token:
            raise AuthenticationError("Invalid reset token")

        if user.password_reset_expires_at and user.password_reset_expires_at < datetime.now(timezone.utc):
            raise AuthenticationError("Reset token has expired")

        user.hashed_password = get_password_hash(new_password)
        user.password_reset_token = None
        user.password_reset_expires_at = None
        await self.db.commit()

    async def create_api_user(self, email: str, name: str, role: UserRole = UserRole.API_USER) -> Tuple[User, str]:
        """Create API user with API key."""
        # Check if user already exists
        existing_user = await self.get_user_by_email(email)
        if existing_user:
            raise ConflictError("User with this email already exists")

        # Generate API key
        api_key = generate_api_key()

        # Create API user
        user = User.create_api_user(
            email=email,
            name=name,
            api_key=api_key,
            role=role
        )

        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        return user, api_key

    async def regenerate_api_key(self, user_id: int) -> str:
        """Regenerate API key for user."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")

        new_api_key = generate_api_key()
        user.api_key = new_api_key
        user.api_key_expires_at = datetime.now(timezone.utc) + timedelta(days=365)
        await self.db.commit()

        return new_api_key

    async def deactivate_user(self, user_id: int) -> None:
        """Deactivate user account."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")

        user.is_active = False
        await self.db.commit()

    async def verify_user_email(self, user_id: int) -> None:
        """Verify user email."""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")

        user.is_verified = True
        await self.db.commit()