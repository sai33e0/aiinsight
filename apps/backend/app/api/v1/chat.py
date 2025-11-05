from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user, require_chat_access
from app.models.user import User

router = APIRouter()


@router.post("/completions")
async def chat_completion(
    current_user: User = Depends(require_chat_access),
    db: AsyncSession = Depends(get_db)
):
    """Create chat completion."""
    # TODO: Implement chat completion
    return {"message": "Chat completion endpoint - to be implemented"}


@router.get("/conversations")
async def list_conversations(
    current_user: User = Depends(require_chat_access),
    db: AsyncSession = Depends(get_db)
):
    """List user conversations."""
    # TODO: Implement conversation listing
    return {"message": "Conversation listing endpoint - to be implemented"}