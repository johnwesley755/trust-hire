import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface TranslationRequest {
    text: string;
    source_language: string;
    target_language: string;
    provider?: string;
}

export interface TranslationResponse {
    translated_text: string;
    source_language: string;
    target_language: string;
    provider: string;
}

export interface BatchTranslationRequest {
    texts: string[];
    source_language: string;
    target_language: string;
    provider?: string;
}

export interface BatchTranslationResponse {
    translated_texts: string[];
    source_language: string;
    target_language: string;
    provider: string;
}

export const translationService = {
    translate: async (request: TranslationRequest): Promise<TranslationResponse> => {
        const response = await axios.post<TranslationResponse>(`${API_URL}/api/translate`, request);
        return response.data;
    },

    translateBatch: async (request: BatchTranslationRequest): Promise<BatchTranslationResponse> => {
        const response = await axios.post<BatchTranslationResponse>(`${API_URL}/api/translate/batch`, request);
        return response.data;
    }
};
