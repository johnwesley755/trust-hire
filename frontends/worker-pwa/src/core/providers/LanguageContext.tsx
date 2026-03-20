import React from 'react';
import type { Language } from '../constants/languages';
import { LanguageContext } from './LanguageContextObject';
import { useTranslation } from 'react-i18next';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const lang: Language = 'en';

  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

