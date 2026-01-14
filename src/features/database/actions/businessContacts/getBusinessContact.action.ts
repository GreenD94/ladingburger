'use server';

import { connectToDatabase } from '../../connection';
import { BusinessContact } from '../../types/index.type';
import { EMPTY_BUSINESS_CONTACT } from '../../constants/emptyObjects.constants';

export async function getBusinessContact(): Promise<BusinessContact> {
  try {
    const db = await connectToDatabase();
    const contact = await db.collection<BusinessContact>('businessContacts').findOne({});

    if (!contact) return EMPTY_BUSINESS_CONTACT;

    return {
      ...contact,
      createdAt: new Date(contact.createdAt),
      updatedAt: new Date(contact.updatedAt),
    };
  } catch (error) {
    console.error('Error getting business contact:', error);
    return EMPTY_BUSINESS_CONTACT;
  }
}

