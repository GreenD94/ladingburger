'use server';

import { connectToDatabase } from '../../connection';
import { BusinessContact } from '../../types';

export async function deleteBusinessContact() {
  try {
    const db = await connectToDatabase();
    
    const result = await db.collection<BusinessContact>('businessContacts').deleteOne({});
    
    return {
      success: true,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    console.error('Error deleting business contact:', error);
    return {
      success: false,
      error: 'Failed to delete business contact',
    };
  }
} 