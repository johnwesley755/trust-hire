import { createContext, useContext } from 'react';

export interface LanguageContextType {
    targetLang: string;
    setTargetLang: (lang: string) => void;
    translations: Record<string, string>;
    isTranslating: boolean;
    translate: (texts: Record<string, string>) => Promise<void>;
    resetTranslations: () => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
