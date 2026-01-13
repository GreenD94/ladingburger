'use client';

import { useContext } from 'react';
import { AdminThemeContext } from '../contexts/AdminThemeContext';

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return context;
}

