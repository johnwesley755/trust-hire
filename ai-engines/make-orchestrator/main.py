import os
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import httpx
import logging
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Make Orchestrator / AI Bridge")

# Service URLs from environment
FACE_MATCH_SERVICE_URL = os.getenv("FACE_MATCH_SERVICE_URL", "http://localhost:5001")
SCORING_ENGINE_URL = os.getenv("SCORING_ENGINE_URL", "http://localhost:5000")

@app.get("/health")
def health_check():
    return {"status": "healthy", "bridge": "active"}

@app.post("/orchestrate/verify-identity")
async def orchestrate_verify_identity(data: dict):
    """
    Orchestrates a multi-step verification process.
    Example: Could call internal AI or external webhooks.
    """
    logger.info("Orchestrating identity verification")
    # This is where complex logic involving multiple steps would go.
    # For now, it acts as a pass-through/logging bridge.
    return {"message": "Verification orchestration received", "data": data}

@app.post("/webhook/make")
async def handle_make_webhook(request: Request):
    """
    Receives webhooks from Make.com (Integromat).
    """
    payload = await request.json()
    logger.info(f"Received webhook from Make.com: {payload}")
    # Process the external automation data here
    return {"status": "received", "source": "make.com"}

@app.post("/ai/unified-search")
async def unified_ai_task(task_type: str, payload: dict):
    """
    A unified gateway to route tasks to different AI engines.
    """
    async with httpx.AsyncClient() as client:
        if task_type == "face-match":
            response = await client.post(f"{FACE_MATCH_SERVICE_URL}/verify/face", json=payload)
        elif task_type == "scoring":
            response = await client.post(f"{SCORING_ENGINE_URL}/score/match", json=payload)
        else:
            raise HTTPException(status_code=400, detail="Unknown task type")
        
        return response.json()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5002))
    uvicorn.run(app, host="0.0.0.0", port=port)
