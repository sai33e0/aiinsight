from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_admin_user
from app.models.user import User

router = APIRouter()


@router.get("/users")
async def list_users(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """List all users (admin only)."""
    # TODO: Implement user management
    return {"message": "User management endpoint - to be implemented"}


@router.get("/system/health")
async def system_health(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get system health status (admin only)."""
    # TODO: Implement system health checks
    return {"message": "System health endpoint - to be implemented"}