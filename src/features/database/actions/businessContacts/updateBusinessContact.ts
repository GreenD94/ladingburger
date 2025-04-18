'use server';

import { connectToDatabase } from '../../connection';
import { BusinessContact } from '../../types';

export async function updateBusinessContact(contact: Partial<Omit<BusinessContact, '_id' | 'createdAt' | 'updatedAt'>>) {
  try {
    const db = await connectToDatabase();
    
    const update = {
      ...contact,
      updatedAt: new Date(),
    };

    const result = await db.collection<BusinessContact>('businessContacts').updateOne(
      {},
      { $set: update },
      { upsert: true }
    );
    
    return {
      success: true,
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    console.error('Error updating business contact:', error);
    return {
      success: false,
      error: 'Failed to update business contact',
    };
  }
} 