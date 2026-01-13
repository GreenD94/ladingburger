'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getSettings } from '@/features/database/actions/settings/getSettings';
import { updateSettings } from '@/features/database/actions/settings/updateSettings';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface LanguageContextValue {
  language: Language;
  isLoading: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const settings = await getSettings();
        setLanguageState(settings.language);
      } catch (error) {
        console.error('Error loading language:', error);
        setLanguageState('en');
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await updateSettings({ language: lang });
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const value: LanguageContextValue = {
    language,
    isLoading,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export { LanguageContext };

