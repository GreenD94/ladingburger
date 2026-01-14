'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getSettings } from '@/features/database/actions/settings/getSettings.action';
import { getMenuTheme, MenuThemeConfig } from '../themes/menuThemes';
import { DEFAULT_THEME_NAME } from '../constants/defaults.constants';

interface MenuThemeContextValue {
  theme: MenuThemeConfig;
  themeName: string;
  isLoading: boolean;
}

const DEFAULT_THEME_CONFIG = getMenuTheme(DEFAULT_THEME_NAME);

const EMPTY_MENU_THEME_CONTEXT_VALUE: MenuThemeContextValue = {
  theme: DEFAULT_THEME_CONFIG,
  themeName: DEFAULT_THEME_NAME,
  isLoading: true,
};

const MenuThemeContext = createContext<MenuThemeContextValue>(EMPTY_MENU_THEME_CONTEXT_VALUE);

interface MenuThemeProviderProps {
  children: ReactNode;
  previewThemeName?: string;
}

export function MenuThemeProvider({ children, previewThemeName }: MenuThemeProviderProps) {
  const [themeConfig, setThemeConfig] = useState<MenuThemeConfig>(DEFAULT_THEME_CONFIG);
  const [themeName, setThemeName] = useState<string>(DEFAULT_THEME_NAME);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTheme = async () => {
      const hasPreviewTheme = previewThemeName && previewThemeName !== '';
      
      if (hasPreviewTheme) {
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
        const defaultTheme = getMenuTheme(DEFAULT_THEME_NAME);
        setThemeConfig(defaultTheme);
        setThemeName(DEFAULT_THEME_NAME);
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

