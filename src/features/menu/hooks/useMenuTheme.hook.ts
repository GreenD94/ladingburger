'use client';

import { useContext } from 'react';
import { MenuThemeContext } from '../contexts/MenuThemeContext.context';

export function useMenuTheme() {
  const context = useContext(MenuThemeContext);
  const hasContext = context !== undefined;
  
  if (!hasContext) {
    throw new Error('useMenuTheme must be used within MenuThemeProvider');
  }
  return context;
}

