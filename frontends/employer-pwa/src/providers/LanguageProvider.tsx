import React, { useState, useRef } from 'react';
import { translationService } from '../services/translation.service';
import { LanguageContext } from './LanguageContext';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [targetLang, setTargetLang] = useState('ta');
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [isTranslating, setIsTranslating] = useState(false);
    
    // Batching logic
    const pendingTexts = useRef<Record<string, string>>({});
    const batchTimeout = useRef<NodeJS.Timeout | null>(null);

    const translate = async (texts: Record<string, string>) => {
        Object.assign(pendingTexts.current, texts);
        if (batchTimeout.current) clearTimeout(batchTimeout.current);

        batchTimeout.current = setTimeout(async () => {
            if (Object.keys(pendingTexts.current).length === 0) return;

            setIsTranslating(true);
            try {
                const currentBatch = { ...pendingTexts.current };
                pendingTexts.current = {};

                const keys = Object.keys(currentBatch);
                const values = Object.values(currentBatch);
                
                const response = await translationService.translateBatch({
                    texts: values,
                    source_language: 'en',
                    target_language: targetLang
                });

                const newTranslations: Record<string, string> = {};
                keys.forEach((key, index) => {
                    newTranslations[key] = response.translated_texts[index];
                });

                setTranslations(prev => ({ ...prev, ...newTranslations }));
            } catch (error) {
                console.error('Translation failed:', error);
            } finally {
                setIsTranslating(false);
                batchTimeout.current = null;
            }
        }, 100);
    };

    const resetTranslations = () => {
        setTranslations({});
    };

    return (
        <LanguageContext.Provider value={{ 
            targetLang, 
            setTargetLang, 
            translations, 
            isTranslating, 
            translate, 
            resetTranslations 
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
