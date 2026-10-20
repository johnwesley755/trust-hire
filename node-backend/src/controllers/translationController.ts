import { Context } from 'hono';
import { batchTranslate } from '../services/translationService';
import { ApiResponse } from '../utils/ApiResponse';

export const translate = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { texts, targetLang, sourceLang } = body;

    if (!targetLang || typeof targetLang !== 'string') {
      return c.json(ApiResponse.error('Missing targetLang parameter'), 400 as any);
    }

    if (!texts || !Array.isArray(texts)) {
      return c.json(ApiResponse.error('texts parameter must be an array of strings'), 400 as any);
    }

    // Limit batch size to 150 items per call for comprehensive page coverage
    const boundedTexts = texts.slice(0, 150);

    const result = await batchTranslate(boundedTexts, targetLang, sourceLang || 'en');

    return c.json(ApiResponse.ok('Translation completed', result));
  } catch (err: any) {
    console.error('[TranslationController] Error handling translation request:', err);
    return c.json(ApiResponse.error(err.message || 'Internal translation service error'), 500 as any);
  }
};
