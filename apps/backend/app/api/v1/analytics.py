from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user, require_analytics_access
from app.models.user import User

router = APIRouter()


@router.get("/usage")
async def get_usage_analytics(
    current_user: User = Depends(require_analytics_access),
    db: AsyncSession = Depends(get_db)
):
    """Get usage analytics."""
    # TODO: Implement usage analytics
    return {"message": "Usage analytics endpoint - to be implemented"}