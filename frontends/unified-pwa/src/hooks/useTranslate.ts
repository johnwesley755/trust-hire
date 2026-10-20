import { useTranslation } from '../providers/TranslationContext';

/**
 * Custom hook to dynamically translate a text string into the active application language.
 * Completely safe against React Virtual DOM crashes because it returns text state rather than
 * injecting real DOM nodes.
 */
export function useTranslate(text: string | null | undefined): string {
  const { translate, language } = useTranslation();

  if (!text || typeof text !== 'string') {
    return '';
  }

  // If active language is English, return directly without queueing
  if (language === 'en') {
    return text;
  }

  return translate(text);
}

export default useTranslate;
