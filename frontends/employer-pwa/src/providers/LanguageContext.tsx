import React, { createContext, useContext, useState } from 'react';
import { translationService } from '../services/translation.service';

interface LanguageContextType {
    targetLang: string;
    setTargetLang: (lang: string) => void;
    translations: Record<string, string>;
    isTranslating: boolean;
    translate: (texts: Record<string, string>) => Promise<void>;
    resetTranslations: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [targetLang, setTargetLang] = useState('hi');
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [isTranslating, setIsTranslating] = useState(false);
    
    // Batching logic
    const pendingTexts = React.useRef<Record<string, string>>({});
    const batchTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const translate = async (texts: Record<string, string>) => {
        // Add texts to the pending queue
        Object.assign(pendingTexts.current, texts);

        // Clear existing timeout
        if (batchTimeout.current) clearTimeout(batchTimeout.current);

        // Set a new timeout to process the batch
        batchTimeout.current = setTimeout(async () => {
            if (Object.keys(pendingTexts.current).length === 0) return;

            setIsTranslating(true);
            try {
                const currentBatch = { ...pendingTexts.current };
                pendingTexts.current = {}; // Clear queue for next batch

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
        }, 100); // 100ms window to collect all strings
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

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
