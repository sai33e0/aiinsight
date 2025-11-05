from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user, require_document_upload
from app.models.user import User

router = APIRouter()


@router.get("/")
async def list_documents(
    current_user: User = Depends(require_document_upload),
    db: AsyncSession = Depends(get_db)
):
    """List user documents."""
    # TODO: Implement document listing
    return {"message": "Document listing endpoint - to be implemented"}


@router.post("/upload")
async def upload_document(
    current_user: User = Depends(require_document_upload),
    db: AsyncSession = Depends(get_db)
):
    """Upload a new document."""
    # TODO: Implement document upload
    return {"message": "Document upload endpoint - to be implemented"}