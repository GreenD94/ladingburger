'use client';

import { useEffect } from 'react';
import { AdminThemeProvider } from '@/features/admin/contexts/AdminThemeContext';
import { LanguageProvider } from '@/features/i18n/contexts/LanguageContext';
import AdminLayoutInner from './layout-inner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.backgroundColor = '';
    document.documentElement.style.backgroundColor = '';
  }, []);

  return (
    <AdminThemeProvider>
      <LanguageProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </LanguageProvider>
    </AdminThemeProvider>
  );
} 