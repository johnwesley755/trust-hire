import { useEffect } from 'react';
import { useLanguage } from '../providers/LanguageContext';

export const useTranslate = (originalTexts: Record<string, string>) => {
    const { translations, translate } = useLanguage();
    
    useEffect(() => {
        const handleTrigger = () => {
            translate(originalTexts);
        };
        window.addEventListener('trigger-translation', handleTrigger);
        return () => window.removeEventListener('trigger-translation', handleTrigger);
    }, [translate, originalTexts]);

    const t = (key: string) => translations[key] || originalTexts[key];

    return { t };
};
