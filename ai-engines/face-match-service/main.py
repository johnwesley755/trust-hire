import os
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from deepface import DeepFace
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Face Match Service")

class FaceMatchRequest(BaseModel):
    img1_path: str
    img2_path: str

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/verify/face")
async def verify_face(request: FaceMatchRequest):
    """
    Verifies if two images contain the same face.
    img1_path and img2_path can be local paths or URLs.
    """
    logger.info(f"Verifying face match between {request.img1_path} and {request.img2_path}")
    
    try:
        # DeepFace.verify returns a dictionary with 'verified' (boolean) and 'distance'
        # Default model_name is 'VGG-Face', detector_backend is 'opencv'
        result = DeepFace.verify(
            img1_path=request.img1_path,
            img2_path=request.img2_path,
            enforce_detection=True,
            model_name="VGG-Face",
            detector_backend="opencv"
        )
        
        logger.info(f"Match result: {result['verified']}, distance: {result['distance']}")
        
        return {
            "verified": result["verified"],
            "distance": result["distance"],
            "threshold": result["threshold"],
            "model": result["model"],
            "detector": result["detector_backend"]
        }
        
    except ValueError as ve:
        logger.error(f"Face detection error: {str(ve)}")
        raise HTTPException(status_code=400, detail=f"Face detection failed: {str(ve)}")
    except Exception as e:
        logger.error(f"Error during face verification: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during face verification")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)
