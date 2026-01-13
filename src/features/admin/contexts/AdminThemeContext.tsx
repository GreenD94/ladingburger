'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AdminThemeMode } from '@/features/database/types/settings';

interface AdminThemeContextValue {
  themeMode: AdminThemeMode;
  isLoading: boolean;
  setThemeMode: (mode: AdminThemeMode) => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

interface AdminThemeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'adminThemeMode';

function getStoredThemeMode(): AdminThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function setStoredThemeMode(mode: AdminThemeMode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, mode);
  }
}

export function AdminThemeProvider({ children }: AdminThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<AdminThemeMode>('light');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedMode = getStoredThemeMode();
    setThemeModeState(storedMode);
    setIsLoading(false);
  }, []);

  const setThemeMode = (mode: AdminThemeMode) => {
    setThemeModeState(mode);
    setStoredThemeMode(mode);
  };

  const value: AdminThemeContextValue = {
    themeMode,
    isLoading,
    setThemeMode,
  };

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}

export { AdminThemeContext };

