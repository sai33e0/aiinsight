"""API v1 endpoints."""

from .auth import router as auth_router
from .chat import router as chat_router
from .documents import router as documents_router
from .admin import router as admin_router
from .analytics import router as analytics_router

__all__ = [
    "auth_router",
    "chat_router",
    "documents_router",
    "admin_router",
    "analytics_router"
]