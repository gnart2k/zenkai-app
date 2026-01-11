'use client';

import { useEffect, useState } from 'react';

export function useLanguageStorage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStoredLanguage = (): string => {
    if (!mounted) return 'en';
    
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  };

  const setStoredLanguage = (language: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  };

  return {
    getStoredLanguage,
    setStoredLanguage,
    mounted
  };
}