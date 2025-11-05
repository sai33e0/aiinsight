from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import HTTPBearer

from app.core.database import get_db
from app.api.deps import get_auth_service, get_current_user
from app.services.auth_service import AuthService
from app.schemas.user import (
    UserLogin, UserRegister, AuthTokens, PasswordResetRequest,
    PasswordReset, UserResponse, UserUpdate, UserCreate
)
from app.models.user import User
from app.core.exceptions import (
    AuthenticationError, ConflictError, NotFoundError,
    BaseCustomException
)

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=AuthTokens)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user."""
    try:
        user, access_token, refresh_token = await auth_service.register_user(
            UserCreate(
                email=user_data.email,
                name=user_data.name,
                password=user_data.password,
                role=user_data.role
            )
        )

        return AuthTokens(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=24 * 3600  # 24 hours in seconds
        )

    except ConflictError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except BaseCustomException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=str(e)
        )


@router.post("/login", response_model=AuthTokens)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Authenticate user and return tokens."""
    try:
        user, access_token, refresh_token = await auth_service.login_user(login_data)

        return AuthTokens(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=24 * 3600  # 24 hours in seconds
        )

    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except BaseCustomException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=str(e)
        )


@router.post("/refresh", response_model=AuthTokens)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Refresh access token using refresh token."""
    try:
        new_access_token, new_refresh_token = await auth_service.refresh_token(refresh_token)

        return AuthTokens(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_in=24 * 3600  # 24 hours in seconds
        )

    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except BaseCustomException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=str(e)
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information."""
    return UserResponse.from_orm(current_user)


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user information."""
    try:
        # Update user fields
        update_data = user_update.dict(exclude_unset=True)

        for field, value in update_data.items():
            if hasattr(current_user, field):
                setattr(current_user, field, value)

        await db.commit()
        await db.refresh(current_user)

        return UserResponse.from_orm(current_user)

    except BaseCustomException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=str(e)
        )


@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Change user password."""
    try:
        await auth_service.change_password(
            current_user.id,
            current_password,
            new_password
        )

        return {"message": "Password changed successfully"}

    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except BaseCustomException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=str(e)
        )


@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest,
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Request password reset."""
    try:
        token = await auth_service.request_password_reset(request.email)

        # In a real application, you would send this token via email
        # For now, we'll just return a success message
        return {
            "message": "If the email exists, a password reset token has been sent",
            "token": token if request.email.endswith("@example.com") else None  # Only show token for test emails
        }

    except BaseCustomException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=str(e)
        )


@router.post("/reset-password")
async def reset_password(
    reset_data: PasswordReset,
    db: AsyncSession = Depends(get_db),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Reset password using token."""
    try:
        await auth_service.reset_password(
            reset_data.token,
            reset_data.new_password
        )

        return {"message": "Password reset successfully"}

    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except BaseCustomException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=str(e)
        )


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user)
):
    """Logout user (client-side token removal)."""
    # In a stateless JWT setup, logout is primarily client-side
    # You could implement token blacklisting if needed
    return {"message": "Logged out successfully"}