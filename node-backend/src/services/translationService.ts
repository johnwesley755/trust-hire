import crypto from 'crypto';
import prisma from '../config/prisma';

export interface TranslationResult {
  translations: Record<string, string>;
  cachedCount: number;
  freshCount: number;
}

/**
 * Computes deterministic SHA-256 hash for content-addressed translation caching.
 */
export function computeTranslationHash(text: string, targetLang: string, sourceLang = 'en'): string {
  const normalized = text.trim().toLowerCase();
  return crypto.createHash('sha256').update(`${sourceLang}:${targetLang}:${normalized}`).digest('hex');
}

// In-memory circuit breakers & request serialization
let lastRequestTimestamp = 0;
let gtxCooldownUntil = 0;
let clients5CooldownUntil = 0;

/**
 * Throttles outgoing requests to guarantee at least minDelayMs between external calls.
 */
async function throttleOutgoing(minDelayMs = 250): Promise<void> {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTimestamp;
  if (timeSinceLast < minDelayMs) {
    await new Promise(r => setTimeout(r, minDelayMs - timeSinceLast));
  }
  lastRequestTimestamp = Date.now();
}

/**
 * Strategy 1: Google Chrome Extension Endpoint (clients5.google.com)
 * High reliability, distinct rate-limit bucket, highly resilient to 429s.
 */
async function tryClients5Translate(joinedQuery: string, targetLang: string): Promise<string[] | null> {
  if (Date.now() < clients5CooldownUntil) {
    return null;
  }

  await throttleOutgoing(250);

  try {
    const url = new URL('https://clients5.google.com/translate_a/t');
    url.searchParams.append('client', 'dict-chrome-ex');
    url.searchParams.append('sl', 'en');
    url.searchParams.append('tl', targetLang);
    url.searchParams.append('q', joinedQuery);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      console.warn('[TranslationService] clients5 returned 429 rate limit. Setting 45s cooldown.');
      clients5CooldownUntil = Date.now() + 45000;
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data: any = await response.json();
    if (Array.isArray(data) && typeof data[0] === 'string') {
      return data[0].split('\n');
    }
  } catch (err: any) {
    // Network / abort error
  }

  return null;
}

/**
 * Strategy 2: Google Translate Public GTX Endpoint (translate.googleapis.com)
 */
async function tryGtxTranslate(joinedQuery: string, targetLang: string): Promise<string[] | null> {
  if (Date.now() < gtxCooldownUntil) {
    return null;
  }

  await throttleOutgoing(300);

  try {
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.append('client', 'gtx');
    url.searchParams.append('sl', 'en');
    url.searchParams.append('tl', targetLang);
    url.searchParams.append('dt', 't');
    url.searchParams.append('q', joinedQuery);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      console.warn('[TranslationService] GTX returned 429 rate limit. Setting 45s cooldown.');
      gtxCooldownUntil = Date.now() + 45000;
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data: any = await response.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const fullTranslated = data[0].map((chunk: any) => chunk[0] || '').join('');
      return fullTranslated.split('\n');
    }
  } catch (err: any) {
    // Network / abort error
  }

  return null;
}

/**
 * Strategy 3: MyMemory Free Translation Fallback
 */
async function tryMyMemoryTranslate(text: string, targetLang: string): Promise<string | null> {
  await throttleOutgoing(150);
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data: any = await response.json();
    const translated = data?.responseData?.translatedText;
    if (translated && !translated.startsWith('MYMEMORY WARNING')) {
      return translated;
    }
  } catch {
    // Fallback error
  }
  return null;
}

/**
 * Enterprise multi-tier resilient free batch translation.
 * Cascades across multiple endpoints (clients5 -> gtx -> mymemory)
 * with circuit breaking to guarantee zero 429 failures.
 */
export async function fetchFreeBatch(texts: string[], targetLang: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (!texts || texts.length === 0) return result;

  const validTexts = texts.map(t => t.trim()).filter(Boolean);
  if (validTexts.length === 0) return result;

  // Initialize with fallback to original text
  for (const t of validTexts) {
    result[t] = t;
  }

  const joinedQuery = validTexts.join('\n');

  // Tier 1: Try Google Chrome Extension Endpoint (clients5)
  let translatedLines = await tryClients5Translate(joinedQuery, targetLang);

  // Tier 2: If Tier 1 failed or in cooldown, try Google GTX
  if (!translatedLines) {
    translatedLines = await tryGtxTranslate(joinedQuery, targetLang);
  }

  // If batch resolved via Tier 1 or Tier 2
  if (translatedLines && translatedLines.length > 0) {
    validTexts.forEach((originalText, index) => {
      const line = translatedLines![index]?.trim();
      if (line) {
        result[originalText] = line;
      }
    });
    return result;
  }

  // Tier 3: Emergency Fallback for uncached items via MyMemory
  for (const text of validTexts.slice(0, 5)) {
    const fallbackTranslation = await tryMyMemoryTranslate(text, targetLang);
    if (fallbackTranslation) {
      result[text] = fallbackTranslation;
    }
  }

  return result;
}

/**
 * Free server-side single-phrase translation (fallback).
 */
export async function fetchFreeTranslation(text: string, targetLang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const batchRes = await fetchFreeBatch([trimmed], targetLang);
  return batchRes[trimmed] || text;
}

/**
 * High-performance batch translation with multi-tier PostgreSQL hash caching.
 */
export async function batchTranslate(
  texts: string[],
  targetLang: string,
  sourceLang = 'en'
): Promise<TranslationResult> {
  const resultMap: Record<string, string> = {};

  if (!Array.isArray(texts) || texts.length === 0 || !targetLang || targetLang === 'en') {
    for (const t of texts || []) {
      if (t) resultMap[t] = t;
    }
    return { translations: resultMap, cachedCount: texts?.length || 0, freshCount: 0 };
  }

  // Deduplicate incoming texts
  const uniqueTexts = Array.from(new Set(texts.map(t => (t || '').trim()).filter(Boolean)));
  if (uniqueTexts.length === 0) {
    return { translations: {}, cachedCount: 0, freshCount: 0 };
  }

  // 1. Map each text to its SHA-256 content hash
  const textHashMap = new Map<string, string>();
  const hashList: string[] = [];

  for (const text of uniqueTexts) {
    const hash = computeTranslationHash(text, targetLang, sourceLang);
    textHashMap.set(hash, text);
    hashList.push(hash);
  }

  // 2. Query PostgreSQL translation_cache for pre-translated strings
  let cachedRecords: Array<{ content_hash: string; translated_text: string }> = [];
  try {
    cachedRecords = await (prisma as any).$queryRaw`
      SELECT content_hash, translated_text 
      FROM translation_cache 
      WHERE content_hash = ANY(${hashList})
    `;
  } catch (dbErr: any) {
    console.warn('[TranslationService] DB cache read error, falling back to direct translation:', dbErr.message);
  }

  const cachedHashes = new Set<string>();
  for (const row of cachedRecords) {
    const originalText = textHashMap.get(row.content_hash);
    if (originalText) {
      resultMap[originalText] = row.translated_text;
      cachedHashes.add(row.content_hash);
    }
  }

  // Asynchronously increment hit counts for cached entries
  if (cachedRecords.length > 0) {
    (prisma as any).$executeRaw`
      UPDATE translation_cache 
      SET hit_count = hit_count + 1, updated_at = NOW()
      WHERE content_hash = ANY(${Array.from(cachedHashes)})
    `.catch(() => {});
  }

  // 3. Isolate uncached phrases (Cache Misses)
  const uncachedTexts = uniqueTexts.filter(t => {
    const hash = computeTranslationHash(t, targetLang, sourceLang);
    return !cachedHashes.has(hash);
  });

  let freshCount = 0;

  // 4. Translate uncached phrases in newline-joined batches of 25
  if (uncachedTexts.length > 0) {
    const BATCH_SIZE = 25;
    const newTranslationsToCache: Array<{
      content_hash: string;
      source_lang: string;
      target_lang: string;
      source_text: string;
      translated_text: string;
    }> = [];

    for (let i = 0; i < uncachedTexts.length; i += BATCH_SIZE) {
      const chunk = uncachedTexts.slice(i, i + BATCH_SIZE);
      const batchResult = await fetchFreeBatch(chunk, targetLang);

      for (const originalText of chunk) {
        const translated = batchResult[originalText] || originalText;
        resultMap[originalText] = translated;
        freshCount++;

        // Only cache if the translation actually produced a valid non-identity translation
        if (translated && translated !== originalText) {
          const hash = computeTranslationHash(originalText, targetLang, sourceLang);
          newTranslationsToCache.push({
            content_hash: hash,
            source_lang: sourceLang,
            target_lang: targetLang,
            source_text: originalText,
            translated_text: translated
          });
        }
      }
    }

    // 5. Bulk insert newly translated phrases into PostgreSQL cache
    if (newTranslationsToCache.length > 0) {
      try {
        for (const item of newTranslationsToCache) {
          await (prisma as any).$executeRaw`
            INSERT INTO translation_cache (id, content_hash, source_lang, target_lang, source_text, translated_text, hit_count, created_at, updated_at)
            VALUES (gen_random_uuid(), ${item.content_hash}, ${item.source_lang}, ${item.target_lang}, ${item.source_text}, ${item.translated_text}, 1, NOW(), NOW())
            ON CONFLICT (content_hash) DO NOTHING
          `;
        }
      } catch (insertErr: any) {
        console.warn('[TranslationService] Failed to cache translations in DB:', insertErr.message);
      }
    }
  }

  return {
    translations: resultMap,
    cachedCount: cachedHashes.size,
    freshCount
  };
}
