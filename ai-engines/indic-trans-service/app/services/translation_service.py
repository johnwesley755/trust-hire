from deep_translator import GoogleTranslator, LibreTranslator
from app.utils.language_map import get_translator_code
import logging

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        logger.info("Initializing Lightweight Translation Service (deep-translator)")

    def get_translator(self, provider: str, source_lang: str, target_lang: str):
        src = get_translator_code(source_lang)
        tgt = get_translator_code(target_lang)
        
        if provider.lower() == "google":
            return GoogleTranslator(source=src, target=tgt)
        elif provider.lower() == "libre":
            # Note: LibreTranslate usually requires an API key or a specific base_url
            return LibreTranslator(source=src, target=tgt)
        else:
            logger.warning(f"Unknown provider '{provider}', falling back to Google")
            return GoogleTranslator(source=src, target=tgt)

    def translate(self, text: str, source_lang: str, target_lang: str, provider: str = "google") -> str:
        try:
            translator = self.get_translator(provider, source_lang, target_lang)
            translated_text = translator.translate(text)
            return translated_text
        except Exception as e:
            logger.error(f"Translation error with {provider}: {str(e)}")
            raise e

    def translate_batch(self, texts: list[str], source_lang: str, target_lang: str, provider: str = "google") -> list[str]:
        try:
            translator = self.get_translator(provider, source_lang, target_lang)
            # deep-translator's GoogleTranslator supports batch translation via list
            translated_texts = translator.translate_batch(texts)
            return translated_texts
        except Exception as e:
            logger.error(f"Batch translation error with {provider}: {str(e)}")
            raise e
