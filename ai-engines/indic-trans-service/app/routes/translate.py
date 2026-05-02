from fastapi import APIRouter, HTTPException, Depends
from app.models.request_response import TranslationRequest, TranslationResponse, BatchTranslationRequest, BatchTranslationResponse
from app.services.translation_service import TranslationService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Single service instance is enough for deep-translator
_service = TranslationService()

def get_translation_service():
    return _service

@router.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest, service: TranslationService = Depends(get_translation_service)):
    try:
        translated = service.translate(
            request.text, 
            request.source_language, 
            request.target_language,
            request.provider
        )
        return TranslationResponse(
            translated_text=translated,
            source_language=request.source_language,
            target_language=request.target_language,
            provider=request.provider
        )
    except Exception as e:
        logger.error(f"Translation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translate-batch", response_model=BatchTranslationResponse)
async def translate_batch(request: BatchTranslationRequest, service: TranslationService = Depends(get_translation_service)):
    try:
        translated_list = service.translate_batch(
            request.texts, 
            request.source_language, 
            request.target_language,
            request.provider
        )
        return BatchTranslationResponse(
            translated_texts=translated_list,
            source_language=request.source_language,
            target_language=request.target_language,
            provider=request.provider
        )
    except Exception as e:
        logger.error(f"Batch translation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
