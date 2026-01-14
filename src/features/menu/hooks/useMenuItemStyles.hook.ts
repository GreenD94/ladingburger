import { MenuThemeConfig } from '../themes/menuThemes';
import React from 'react';

interface MenuItemStyles {
  containerStyle: React.CSSProperties;
}

export const useMenuItemStyles = (
  theme: MenuThemeConfig,
  paddingLeft: string,
  paddingRight: string
): MenuItemStyles => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100dvh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.backgroundColor,
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    position: 'relative',
    overflow: 'hidden',
    margin: 0,
    paddingLeft,
    paddingRight,
  };

  return { containerStyle };
};

