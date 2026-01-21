'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export interface AdminListItem {
  _id: string;
  email: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAdminsResponse {
  success: boolean;
  data?: AdminListItem[];
  error?: string;
}

export async function getAdminsAction(): Promise<GetAdminsResponse> {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admins');

    const admins = await adminsCollection
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    const result: AdminListItem[] = admins.map((admin) => ({
      _id: admin._id.toString(),
      email: admin.email || EMPTY_STRING,
      isEnabled: admin.isEnabled !== undefined ? admin.isEnabled : true,
      createdAt: admin.createdAt ? new Date(admin.createdAt) : EMPTY_DATE,
      updatedAt: admin.updatedAt ? new Date(admin.updatedAt) : EMPTY_DATE,
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error fetching admins:', error);
    return {
      success: false,
      error: 'Error al cargar los administradores',
    };
  }
}

