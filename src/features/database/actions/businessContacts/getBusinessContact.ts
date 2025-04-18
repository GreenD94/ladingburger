'use server';

import { connectToDatabase } from '../../connection';
import { BusinessContact } from '../../types';

export async function getBusinessContact() {
  try {
    const db = await connectToDatabase();
    const contact = await db.collection<BusinessContact>('businessContacts').findOne({});

    if (!contact) return null;

    // Convert MongoDB fields to serializable values
    return {
      ...contact,
      _id: contact._id.toString(),
      createdAt: new Date(contact.createdAt).toISOString(),
      updatedAt: new Date(contact.updatedAt).toISOString(),
      dolarRateUpdatedAt: new Date(contact.dolarRateUpdatedAt).toISOString(),
    };
  } catch (error) {
    console.error('Error getting business contact:', error);
    return null;
  }
} 