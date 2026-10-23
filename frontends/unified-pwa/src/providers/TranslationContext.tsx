import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { getStaticTranslation as lookupStaticTranslation } from '../locales';

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  native: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English', region: 'All India / Global' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'North / Central India' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu & Puducherry' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Andhra Pradesh & Telangana' }
];

interface TranslationContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  translate: (text: string) => string;
  t: (text: string, fallback?: string) => string;
  batchTranslateTexts: (texts: string[]) => Promise<Record<string, string>>;
  getCachedTranslation: (text: string) => string | undefined;
  getStaticTranslation: (text: string) => string | undefined;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'trusthyre_app_language';
const CACHE_STORAGE_PREFIX = 'trusthyre_trans_cache_';

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as SupportedLanguage;
      if (saved && ['en', 'hi', 'ta', 'te'].includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'en';
  });

  // In-memory cache: key = `${targetLang}:${text.trim()}` -> translatedText
  const cacheRef = useRef<Map<string, string>>(new Map());
  // Subscribed listeners to trigger re-renders when a batch completes
  const [, setVersion] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);

  // Batching queue
  const pendingBatchRef = useRef<Set<string>>(new Set());
  const batchTimeoutRef = useRef<any>(null);

  // Hydrate local cache on language change
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, language);
      const cachedData = localStorage.getItem(`${CACHE_STORAGE_PREFIX}${language}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        for (const [k, v] of Object.entries(parsed)) {
          cacheRef.current.set(`${language}:${k}`, v as string);
        }
      }
    } catch {
      // Ignore storage errors
    }
    // Re-render components with newly selected language
    setVersion(v => v + 1);
  }, [language]);

  // Flush pending translation batch to backend API
  const flushBatch = useCallback(async () => {
    const textsToTranslate = Array.from(pendingBatchRef.current);
    pendingBatchRef.current.clear();
    batchTimeoutRef.current = null;

    if (textsToTranslate.length === 0 || language === 'en') {
      return;
    }

    try {
      setIsTranslating(true);
      const res = await apiClient.post('/api/translate', {
        texts: textsToTranslate,
        targetLang: language,
        sourceLang: 'en'
      });

      const raw = res.data?.data?.translations ?? res.data?.translations ?? res.data?.data ?? res.data;
      const translations = (raw && typeof raw === 'object' && 'translations' in raw) ? (raw as any).translations : raw;
      if (translations && typeof translations === 'object') {
        const currentLangCache: Record<string, string> = {};

        for (const [orig, trans] of Object.entries(translations)) {
          const key = `${language}:${orig.trim()}`;
          cacheRef.current.set(key, trans as string);
          currentLangCache[orig.trim()] = trans as string;
        }

        // Persist slice to localStorage for instant load next session
        try {
          const existing = JSON.parse(localStorage.getItem(`${CACHE_STORAGE_PREFIX}${language}`) || '{}');
          const merged = { ...existing, ...currentLangCache };
          localStorage.setItem(`${CACHE_STORAGE_PREFIX}${language}`, JSON.stringify(merged));
        } catch {
          // Ignore storage overflow
        }

        // Trigger re-render so components update their translated text
        setVersion(v => v + 1);
      }
    } catch (err: any) {
      console.warn('[TranslationProvider] Batch translation error:', err?.message || err);
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  // Static dictionary lookup helper
  const getStaticTranslation = useCallback((text: string): string | undefined => {
    return lookupStaticTranslation(text, language);
  }, [language]);

  // Request translation for a string (Static -> Dynamic Cache -> Dynamic Network)
  const translate = useCallback((text: string): string => {
    if (!text || typeof text !== 'string') return '';
    const trimmed = text.trim();
    if (!trimmed || language === 'en') return text;

    // 1. Check static dictionary first (0ms, zero network)
    const staticTrans = lookupStaticTranslation(trimmed, language);
    if (staticTrans) {
      return staticTrans;
    }

    // 2. Check dynamic cache (0ms)
    const cacheKey = `${language}:${trimmed}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. Queue for dynamic translation batch if not already queued
    pendingBatchRef.current.add(trimmed);

    // Debounce 100ms to collect dynamic rendered items
    if (!batchTimeoutRef.current) {
      batchTimeoutRef.current = setTimeout(flushBatch, 100);
    }

    // Return original English text while translating in background
    return text;
  }, [language, flushBatch]);

  // Convenient alias for components: t("Find Jobs")
  const t = useCallback((text: string, fallback?: string): string => {
    const res = translate(text);
    return res || fallback || text;
  }, [translate]);

  // Synchronous cache lookup (Static -> In-Memory Dynamic Cache)
  const getCachedTranslation = useCallback((text: string): string | undefined => {
    if (!text || typeof text !== 'string') return undefined;
    const trimmed = text.trim();
    if (!trimmed) return undefined;
    if (language === 'en') return text;

    // Check static first (0ms)
    const staticTrans = lookupStaticTranslation(trimmed, language);
    if (staticTrans) {
      return staticTrans;
    }

    return cacheRef.current.get(`${language}:${trimmed}`);
  }, [language]);

  // Bulk translation for full-page DOM translation
  const batchTranslateTexts = useCallback(async (texts: string[]): Promise<Record<string, string>> => {
    if (!texts || texts.length === 0 || language === 'en') {
      const identity: Record<string, string> = {};
      texts.forEach(item => { identity[item] = item; });
      return identity;
    }

    const result: Record<string, string> = {};
    const missing: string[] = [];

    // 1. Gather all currently cached or static translations
    for (const item of texts) {
      const trimmed = item.trim();
      if (!trimmed) continue;

      // Check static dictionary first (0ms)
      const staticTrans = lookupStaticTranslation(trimmed, language);
      if (staticTrans) {
        result[trimmed] = staticTrans;
        continue;
      }

      const cached = cacheRef.current.get(`${language}:${trimmed}`);
      if (cached) {
        result[trimmed] = cached;
      } else {
        missing.push(trimmed);
      }
    }

    // 2. If nothing missing, return immediately
    if (missing.length === 0) {
      return result;
    }

    // Deduplicate missing
    const uniqueMissing = Array.from(new Set(missing));

    try {
      setIsTranslating(true);
      // Process in chunks of 50 to prevent huge request payloads
      const CHUNK_SIZE = 50;
      for (let i = 0; i < uniqueMissing.length; i += CHUNK_SIZE) {
        const chunk = uniqueMissing.slice(i, i + CHUNK_SIZE);
        const res = await apiClient.post('/api/translate', {
          texts: chunk,
          targetLang: language,
          sourceLang: 'en'
        });

        const raw = res.data?.data?.translations ?? res.data?.translations ?? res.data?.data ?? res.data;
        const translations = (raw && typeof raw === 'object' && 'translations' in raw) ? (raw as any).translations : raw;
        if (translations && typeof translations === 'object') {
          const currentLangCache: Record<string, string> = {};
          for (const [orig, trans] of Object.entries(translations)) {
            const trimmedOrig = orig.trim();
            const translatedVal = trans as string;
            cacheRef.current.set(`${language}:${trimmedOrig}`, translatedVal);
            currentLangCache[trimmedOrig] = translatedVal;
            result[trimmedOrig] = translatedVal;
          }

          // Persist slice to localStorage
          try {
            const existing = JSON.parse(localStorage.getItem(`${CACHE_STORAGE_PREFIX}${language}`) || '{}');
            const merged = { ...existing, ...currentLangCache };
            localStorage.setItem(`${CACHE_STORAGE_PREFIX}${language}`, JSON.stringify(merged));
          } catch {
            // Ignore storage overflow
          }
        }
      }
    } catch (err: any) {
      console.warn('[TranslationProvider] batchTranslateTexts error:', err?.message || err);
    } finally {
      setIsTranslating(false);
    }

    return result;
  }, [language]);

  // Set language and sync with backend user settings if possible
  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
      // Optional async sync to backend user settings
      apiClient.put('/api/settings', { language: newLang }).catch(() => {});
    } catch {
      // Ignore
    }
  }, []);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
        translate,
        t,
        batchTranslateTexts,
        getCachedTranslation,
        getStaticTranslation,
        isTranslating
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
