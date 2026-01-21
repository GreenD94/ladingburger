'use server';

import { connectToDatabase } from '../../connection';
import { BusinessContact } from '../../types/index.type';
import { EMPTY_BUSINESS_CONTACT } from '../../constants/emptyObjects.constants';

interface MongoBusinessContactDocument {
  _id?: { toString(): string };
  whatsappLink?: string;
  instagramLink?: string;
  venezuelaPayment?: {
    phoneNumber?: string;
    bankAccount?: string;
    documentNumber?: string;
  };
  qrCodeUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export async function getBusinessContact(): Promise<BusinessContact> {
  try {
    const db = await connectToDatabase();
    const contact = await db.collection<MongoBusinessContactDocument>('businessContacts').findOne({});

    if (!contact) return EMPTY_BUSINESS_CONTACT;

    const plainContact = {
      whatsappLink: String(contact.whatsappLink || ''),
      instagramLink: String(contact.instagramLink || ''),
      venezuelaPayment: {
        phoneNumber: String(contact.venezuelaPayment?.phoneNumber || ''),
        bankAccount: String(contact.venezuelaPayment?.bankAccount || ''),
        documentNumber: String(contact.venezuelaPayment?.documentNumber || ''),
      },
      qrCodeUrl: String(contact.qrCodeUrl || ''),
      createdAt: contact.createdAt instanceof Date 
        ? contact.createdAt.toISOString()
        : typeof contact.createdAt === 'string'
        ? contact.createdAt
        : contact.createdAt
        ? new Date(contact.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: contact.updatedAt instanceof Date 
        ? contact.updatedAt.toISOString()
        : typeof contact.updatedAt === 'string'
        ? contact.updatedAt
        : contact.updatedAt
        ? new Date(contact.updatedAt).toISOString()
        : new Date().toISOString(),
    };

    return {
      whatsappLink: plainContact.whatsappLink,
      instagramLink: plainContact.instagramLink,
      venezuelaPayment: plainContact.venezuelaPayment,
      qrCodeUrl: plainContact.qrCodeUrl,
      createdAt: plainContact.createdAt as unknown as Date,
      updatedAt: plainContact.updatedAt as unknown as Date,
    };
  } catch (error) {
    console.error('Error getting business contact:', error);
    return EMPTY_BUSINESS_CONTACT;
  }
}

