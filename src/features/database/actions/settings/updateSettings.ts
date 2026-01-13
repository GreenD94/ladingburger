'use server';

import clientPromise from '@/features/database/config/mongodb';
import { Settings, MenuTheme, Language } from '@/features/database/types/settings';

export interface UpdateSettingsInput {
  menuTheme?: MenuTheme;
  language?: Language;
}

export async function updateSettings(input: UpdateSettingsInput): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('saborea');

    const updateData: Partial<Settings> = {
      updatedAt: new Date(),
    };

    if (input.menuTheme !== undefined) {
      updateData.menuTheme = input.menuTheme;
    }

    if (input.language !== undefined) {
      updateData.language = input.language;
    }

    const setOnInsertData: Partial<Settings> = {
      menuTheme: 'green',
      adminThemeMode: 'light',
    };

    if (input.language === undefined) {
      setOnInsertData.language = 'en';
    }

    await db.collection<Settings>('settings').updateOne(
      {},
      {
        $set: updateData,
        $setOnInsert: setOnInsertData,
      },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating settings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

