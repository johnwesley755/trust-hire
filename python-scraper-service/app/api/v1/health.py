from fastapi import APIRouter
from sqlalchemy import text
from app.api.deps import DBSessionDep

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def get_health(db: DBSessionDep):
    """Health check validating microservice and PostgreSQL database availability."""
    db_status = "UP"
    error_msg = None
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = "DOWN"
        error_msg = str(e)

    return {
        "status": "UP" if db_status == "UP" else "DEGRADED",
        "service": "TrustHyre Blue-Collar Scraping Microservice",
        "database": db_status,
        "error": error_msg,
    }
