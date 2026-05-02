from pydantic import BaseModel, Field
from typing import List, Optional

class TranslationRequest(BaseModel):
    source_language: str = Field(..., example="en")
    target_language: str = Field(..., example="ta")
    text: str = Field(..., example="Hello")
    provider: Optional[str] = Field("google", example="google")

class BatchTranslationRequest(BaseModel):
    source_language: str = Field(..., example="en")
    target_language: str = Field(..., example="ta")
    texts: List[str] = Field(..., example=["Hello", "World"])
    provider: Optional[str] = Field("google", example="google")

class TranslationResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str
    provider: str

class BatchTranslationResponse(BaseModel):
    translated_texts: List[str]
    source_language: str
    target_language: str
    provider: str
