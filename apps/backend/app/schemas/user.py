from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

from app.models.user import UserRole, SubscriptionPlan


class UserRoleEnum(str, Enum):
    """User role enumeration for API."""
    ADMIN = UserRole.ADMIN.value
    USER = UserRole.USER.value
    API_USER = UserRole.API_USER.value


class SubscriptionPlanEnum(str, Enum):
    """Subscription plan enumeration for API."""
    FREE = SubscriptionPlan.FREE.value
    PRO = SubscriptionPlan.PRO.value
    ENTERPRISE = SubscriptionPlan.ENTERPRISE.value


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr = Field(..., description="User email address")
    name: str = Field(..., min_length=1, max_length=255, description="User full name")


class UserCreate(UserBase):
    """User creation schema."""
    password: str = Field(..., min_length=8, max_length=255, description="User password")
    role: Optional[UserRoleEnum] = Field(UserRoleEnum.USER, description="User role")

    @validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserUpdate(BaseModel):
    """User update schema."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    role: Optional[UserRoleEnum] = None
    is_active: Optional[bool] = None
    bio: Optional[str] = Field(None, max_length=1000)
    avatar_url: Optional[str] = Field(None, max_length=500)
    subscription_plan: Optional[SubscriptionPlanEnum] = None


class UserResponse(BaseModel):
    """User response schema."""
    id: int
    email: str
    name: str
    role: UserRoleEnum
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str]
    bio: Optional[str]
    requests_count: int
    tokens_used: int
    subscription_plan: SubscriptionPlanEnum
    subscription_expires_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    last_active_at: Optional[datetime]
    last_login_at: Optional[datetime]

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """User login schema."""
    email: EmailStr
    password: str


class UserRegister(UserCreate):
    """User registration schema."""
    confirm_password: str = Field(..., description="Confirm password")

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        """Validate that passwords match."""
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v


class AuthTokens(BaseModel):
    """Authentication tokens schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class PasswordResetRequest(BaseModel):
    """Password reset request schema."""
    email: EmailStr


class PasswordReset(BaseModel):
    """Password reset schema."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=255)
    confirm_password: str

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        """Validate that passwords match."""
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

    @validator('new_password')
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v