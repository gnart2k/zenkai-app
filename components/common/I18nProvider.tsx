'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'en' | 'ja' | 'ko' | 'vi';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const languages = {
  en: () => import('../../locales/en/common.json'),
  ja: () => import('../../locales/ja/common.json'),
  ko: () => import('../../locales/ko/common.json'),
  vi: () => import('../../locales/vi/common.json'),
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Get language from localStorage or default to 'en'
    const storedLanguage = (localStorage.getItem('language') as Language) || 'en';
    setLanguageState(storedLanguage);
    loadTranslations(storedLanguage);
  }, []);

  const loadTranslations = async (lang: Language) => {
    try {
      const translationModule = await languages[lang]();
      setTranslations(translationModule.default);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      // Fallback to English
      if (lang !== 'en') {
        const englishTranslations = await languages.en();
        setTranslations(englishTranslations.default);
      }
    }
  };

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    loadTranslations(lang);
  };

  // Get nested translation by key (e.g., 'dashboard.title')
  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}