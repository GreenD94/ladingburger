'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getSettings } from '@/features/database/actions/settings/getSettings';
import { getMenuTheme, MenuThemeConfig } from '../themes/menuThemes';

interface MenuThemeContextValue {
  theme: MenuThemeConfig;
  themeName: string;
  isLoading: boolean;
}

const MenuThemeContext = createContext<MenuThemeContextValue | null>(null);

interface MenuThemeProviderProps {
  children: ReactNode;
  previewThemeName?: string;
}

export function MenuThemeProvider({ children, previewThemeName }: MenuThemeProviderProps) {
  const [themeConfig, setThemeConfig] = useState<MenuThemeConfig>(getMenuTheme('green'));
  const [themeName, setThemeName] = useState<string>('green');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTheme = async () => {
      if (previewThemeName) {
        const previewTheme = getMenuTheme(previewThemeName);
        setThemeConfig(previewTheme);
        setThemeName(previewThemeName);
        setIsLoading(false);
        return;
      }

      try {
        const settings = await getSettings();
        const theme = getMenuTheme(settings.menuTheme);
        setThemeConfig(theme);
        setThemeName(settings.menuTheme);
      } catch (error) {
        console.error('Error loading menu theme:', error);
        const defaultTheme = getMenuTheme('green');
        setThemeConfig(defaultTheme);
        setThemeName('green');
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [previewThemeName]);

  const value: MenuThemeContextValue = {
    theme: themeConfig,
    themeName,
    isLoading,
  };

  return <MenuThemeContext.Provider value={value}>{children}</MenuThemeContext.Provider>;
}

export { MenuThemeContext };

