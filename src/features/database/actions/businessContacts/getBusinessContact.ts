'use server';

import { connectToDatabase } from '../../connection';
import { BusinessContact } from '../../types';

export async function getBusinessContact() {
  try {
    const db = await connectToDatabase();
    const contact = await db.collection<BusinessContact>('businessContacts').findOne({});

    return contact;
  } catch (error) {
    console.error('Error getting business contact:', error);
    return null;
  }
} 