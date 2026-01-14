'use client';

import { useSearchParams } from 'next/navigation';
import { MenuProviders } from '../components/MenuProviders.component';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export const MenuContainer = () => {
  const searchParams = useSearchParams();
  const previewThemeNameParam = searchParams.get('theme');
  const previewThemeName = previewThemeNameParam || EMPTY_STRING;
  const hasPreviewTheme = previewThemeName !== EMPTY_STRING;

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
      <MenuProviders previewThemeName={hasPreviewTheme ? previewThemeName : undefined} />
    </div>
  );
};

