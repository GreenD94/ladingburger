'use client';

import React from 'react';
import { MenuItem } from './MenuItem.component';
import { LoadingScreen } from './LoadingScreen.component';
import { ErrorMessage } from './ErrorMessage.component';
import { EmptyMenuState } from './EmptyMenuState.component';
import { MenuAnimations } from '../styles/menuAnimations.styles';
import { useMenuTheme } from '../hooks/useMenuTheme.hook';
import { useMenuLoading } from '../hooks/useMenuLoading.hook';
import { BOTTOM_SPACER_HEIGHT } from '../constants/dimensions.constants';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export const MenuList: React.FC = () => {
  const { theme } = useMenuTheme();
  const { burgers, loading, isExiting, showLoader, error } = useMenuLoading();

  const isLoadingComplete = !loading;
  const hasError = error !== EMPTY_STRING;
  const shouldShowError = isLoadingComplete && hasError;
  const shouldShowContent = isLoadingComplete && !hasError;
  const hasBurgers = burgers.length > 0;

  return (
    <>
      <MenuAnimations />
      <LoadingScreen
        theme={theme}
        loading={loading}
        isExiting={isExiting}
        showLoader={showLoader}
      />
      {shouldShowError && <ErrorMessage message={error} />}
      {shouldShowContent && (
        <>
          {hasBurgers ? (
            burgers.map((burger, index) => (
              <MenuItem key={burger._id?.toString() || index} burger={burger} index={index} />
            ))
          ) : (
            <EmptyMenuState />
          )}
          <div
            style={{
              width: '100%',
              height: BOTTOM_SPACER_HEIGHT,
              boxSizing: 'border-box',
            }}
          />
        </>
      )}
    </>
  );
};

