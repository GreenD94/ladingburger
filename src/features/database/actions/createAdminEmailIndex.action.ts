'use server';

import { connectToDatabase } from './connect.action';

export interface CreateIndexResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function createAdminEmailIndexAction(): Promise<CreateIndexResponse> {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admins');

    const indexExists = await adminsCollection.indexExists('email_1');
    if (indexExists) {
      return {
        success: true,
        message: 'Unique index on email field already exists',
      };
    }

    await adminsCollection.createIndex({ email: 1 }, { unique: true });

    return {
      success: true,
      message: 'Unique index on email field created successfully',
    };
  } catch (error) {
    console.error('Error creating admin email index:', error);
    
    if (error instanceof Error && error.message.includes('E11000')) {
      return {
        success: false,
        error: 'Cannot create unique index: duplicate emails exist in database. Please remove duplicates first.',
      };
    }
    
    return {
      success: false,
      error: 'Error creating unique index on email field',
    };
  }
}

