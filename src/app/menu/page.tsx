'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MenuList } from '@/features/menu/components/MenuList';
import { MenuThemeProvider } from '@/features/menu/contexts/MenuThemeContext';
import { SafeArea } from '@/features/menu/components/SafeArea';

function MenuPageContent() {
  const searchParams = useSearchParams();
  const previewThemeName = searchParams.get('theme') || '';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100dvh',
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className="menu-scroll-container"
    >
      <style jsx>{`
        .menu-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <MenuThemeProvider previewThemeName={previewThemeName || undefined}>
        <SafeArea style={{ paddingTop: '5px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '5px' }}>
          <MenuList />
        </SafeArea>
      </MenuThemeProvider>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuPageContent />
    </Suspense>
  );
}
