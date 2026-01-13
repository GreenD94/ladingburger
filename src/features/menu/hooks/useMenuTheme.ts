'use client';

import { useContext } from 'react';
import { MenuThemeContext } from '../contexts/MenuThemeContext';

export function useMenuTheme() {
  const context = useContext(MenuThemeContext);
  if (!context) {
    throw new Error('useMenuTheme must be used within MenuThemeProvider');
  }
  return context;
}

