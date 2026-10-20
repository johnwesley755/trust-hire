import { en } from './en';
import { ta } from './ta';
import { hi } from './hi';
import { te } from './te';
import type { SupportedLanguage } from '../providers/TranslationContext';

export const dictionaries: Record<SupportedLanguage, Record<string, string>> = {
  en,
  ta,
  hi,
  te
};

/**
 * Returns curated static translation in O(1) time without network or DB calls.
 */
export function getStaticTranslation(text: string, lang: SupportedLanguage): string | undefined {
  if (!text || typeof text !== 'string') return undefined;
  if (lang === 'en') return text;
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  const dict = dictionaries[lang];
  if (!dict) return undefined;

  // 1. Direct exact match
  if (dict[trimmed]) {
    return dict[trimmed];
  }

  // 2. Case-insensitive lookup fallback
  const lowerTrimmed = trimmed.toLowerCase();
  for (const [key, value] of Object.entries(dict)) {
    if (key.toLowerCase() === lowerTrimmed) {
      return value;
    }
  }

  return undefined;
}

/**
 * Checks if a phrase is registered in the static dictionaries.
 */
export function isStaticPhrase(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return Boolean(en[trimmed]);
}

export { en, ta, hi, te };
