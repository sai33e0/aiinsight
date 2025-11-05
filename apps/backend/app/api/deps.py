from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.core.security import verify_token
from app.services.auth_service import AuthService
from app.models.user import User, UserRole
from app.core.exceptions import AuthenticationError, AuthorizationError

# HTTP Bearer scheme for token authentication
security = HTTPBearer(auto_error=False)


async def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    """Get authentication service instance."""
    return AuthService(db)


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> Optional[User]:
    """Get current user from optional token."""
    if not credentials:
        return None

    try:
        user_id = verify_token(credentials.credentials)
        user = await auth_service.get_user_by_id(int(user_id))

        if not user or not user.is_active:
            return None

        return user
    except Exception:
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    """Get current authenticated user."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = verify_token(credentials.credentials)
        user = await auth_service.get_user_by_id(int(user_id))

        if not user:
            raise AuthenticationError("User not found")

        if not user.is_active:
            raise AuthenticationError("User account is deactivated")

        # Update user activity
        await auth_service.update_user_activity(user.id)

        return user

    except AuthenticationError:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current admin user."""
    if current_user.role != UserRole.ADMIN:
        raise AuthorizationError("Admin access required")
    return current_user


async def get_api_user(
    x_api_key: Optional[str] = Header(None),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    """Get user from API key."""
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    user = await auth_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key is deactivated",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    # Update user activity
    await auth_service.update_user_activity(user.id)

    return user


def require_role(required_role: UserRole):
    """Create dependency to require specific user role."""
    async def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != required_role and current_user.role != UserRole.ADMIN:
            raise AuthorizationError(f"{required_role.value} access required")
        return current_user

    return role_dependency


def require_min_role(min_role: UserRole):
    """Create dependency to require minimum user role."""
    role_hierarchy = {
        UserRole.USER: 1,
        UserRole.API_USER: 2,
        UserRole.ADMIN: 3
    }

    async def min_role_dependency(current_user: User = Depends(get_current_user)) -> User:
        user_role_level = role_hierarchy.get(current_user.role, 0)
        required_role_level = role_hierarchy.get(min_role, 0)

        if user_role_level < required_role_level:
            raise AuthorizationError(f"{min_role.value} access or higher required")
        return current_user

    return min_role_dependency


# Feature access dependencies
async def require_chat_access(current_user: User = Depends(get_current_user)) -> User:
    """Require user to have chat access."""
    if not current_user.can_access_feature("basic_chat"):
        raise AuthorizationError("Chat access not available in current subscription plan")
    return current_user


async def require_document_upload(current_user: User = Depends(get_current_user)) -> User:
    """Require user to have document upload access."""
    if not current_user.can_access_feature("document_upload"):
        raise AuthorizationError("Document upload not available in current subscription plan")
    return current_user


async def require_analytics_access(current_user: User = Depends(get_current_user)) -> User:
    """Require user to have analytics access."""
    if not current_user.can_access_feature("analytics"):
        raise AuthorizationError("Analytics not available in current subscription plan")
    return current_user


async def require_api_access(current_user: User = Depends(get_current_user)) -> User:
    """Require user to have API access."""
    if not current_user.can_access_feature("api_access"):
        raise AuthorizationError("API access not available in current subscription plan")
    return current_user


# Rate limiting dependencies
async def check_rate_limit(
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    """Check if user has exceeded rate limits."""
    # This would typically integrate with Redis or similar
    # For now, just check basic subscription limits
    if current_user.subscription_plan.value == "free":
        # Check daily request limit
        if current_user.requests_count > 50:  # Free plan daily limit
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Daily request limit exceeded. Upgrade to Pro for unlimited access."
            )

    return current_user