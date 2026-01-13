export interface MenuThemeConfig {
  backgroundColor: string;
  primaryColor: string;
  textColor: string;
  loadingScreenBackgroundColor: string;
}

export const GREEN_THEME: MenuThemeConfig = {
  backgroundColor: '#1a4d3a',
  primaryColor: '#FF6B35',
  textColor: '#ddd9dc',
  loadingScreenBackgroundColor: '#1a4d3a',
};

const MENU_THEMES: Record<string, MenuThemeConfig> = {
  green: GREEN_THEME,
};

export function getMenuTheme(themeName: string): MenuThemeConfig {
  return MENU_THEMES[themeName] || GREEN_THEME;
}

export function getAllMenuThemes(): Record<string, MenuThemeConfig> {
  return MENU_THEMES;
}

