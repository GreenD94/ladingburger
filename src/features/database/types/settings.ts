import { ObjectId } from 'mongodb';

export type MenuTheme = 'green' | string;

export type AdminThemeMode = 'light' | 'dark';

export type Language = 'en' | 'es';

export interface Settings {
  _id: ObjectId;
  menuTheme: MenuTheme;
  adminThemeMode: AdminThemeMode;
  language: Language;
  updatedAt: Date;
}

export interface SettingsResponse {
  _id: string;
  menuTheme: MenuTheme;
  adminThemeMode: AdminThemeMode;
  language: Language;
  updatedAt: string;
}

