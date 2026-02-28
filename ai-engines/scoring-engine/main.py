import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Job-Worker Scoring Engine")

class ScoreRequest(BaseModel):
    job_description: str
    worker_profile: str
    worker_skills: List[str]

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/score/match")
async def calculate_score(request: ScoreRequest):
    """
    Calculates a match score between a job description and a worker profile/skills.
    """
    logger.info("Calculating match score")
    
    try:
        # Combine worker data for a richer text representation
        worker_text = f"{request.worker_profile} {' '.join(request.worker_skills)}"
        job_text = request.job_description
        
        # Initialize TF-IDF Vectorizer
        vectorizer = TfidfVectorizer(stop_words='english')
        
        # Fit and transform the texts
        tfidf_matrix = vectorizer.fit_transform([job_text, worker_text])
        
        # Calculate Cosine Similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        # Normalize score to 0-100
        final_score = round(similarity * 100, 2)
        
        logger.info(f"Calculated match score: {final_score}")
        
        return {
            "score": final_score,
            "similarity": similarity,
            "interpretation": "Strong Match" if final_score > 70 else "Moderate Match" if final_score > 40 else "Weak Match"
        }
        
    except Exception as e:
        logger.error(f"Error during scoring: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during scoring calculation")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
