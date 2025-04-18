'use server';

import { connectToDatabase } from '../../connection';
import { BusinessContact } from '../../types';

export async function createBusinessContact(contact: Omit<BusinessContact, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    const db = await connectToDatabase();
    
    const newContact: BusinessContact = {
      ...contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<BusinessContact>('businessContacts').insertOne(newContact);
    return {
      success: true,
      contactId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Error creating business contact:', error);
    return {
      success: false,
      error: 'Failed to create business contact',
    };
  }
} 