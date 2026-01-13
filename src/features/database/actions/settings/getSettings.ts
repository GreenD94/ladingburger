'use server';

import clientPromise from '@/features/database/config/mongodb';
import { Settings, SettingsResponse } from '@/features/database/types/settings';

const DEFAULT_MENU_THEME = 'green';
const DEFAULT_LANGUAGE = 'en';

export async function getSettings(): Promise<SettingsResponse> {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');
    let settings = await db.collection<Settings>('settings').findOne({});

    if (!settings) {
      const defaultSettingsData: Omit<Settings, '_id'> = {
        menuTheme: DEFAULT_MENU_THEME,
        adminThemeMode: 'light',
        language: DEFAULT_LANGUAGE,
        updatedAt: new Date(),
      };
      
      const result = await db.collection<Settings>('settings').insertOne(defaultSettingsData as Settings);
      settings = { _id: result.insertedId, ...defaultSettingsData };
    }

    return {
      _id: settings._id.toString(),
      menuTheme: settings.menuTheme,
      adminThemeMode: settings.adminThemeMode,
      language: settings.language,
      updatedAt: settings.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      _id: '',
      menuTheme: DEFAULT_MENU_THEME,
      adminThemeMode: 'light',
      language: DEFAULT_LANGUAGE,
      updatedAt: new Date().toISOString(),
    };
  }
}

