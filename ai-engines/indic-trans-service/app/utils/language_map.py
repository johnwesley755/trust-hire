# Mapping of language codes for deep-translator (Google Translator uses ISO 639-1)

LANGUAGE_MAP = {
    "en": "en",
    "hi": "hi",
    "ta": "ta",
    "te": "te",
    "ml": "ml",
    "kn": "kn",
    "mr": "mr",
    "bn": "bn",
    "gu": "gu",
    "pa": "pa",
    "or": "or",
    "as": "as"
}

def get_translator_code(lang_code: str) -> str:
    """Returns the code used by deep-translator for a given ISO 639-1 code."""
    return LANGUAGE_MAP.get(lang_code.lower(), lang_code)
