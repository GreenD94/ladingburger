'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { ObjectId } from 'mongodb';
import { EMPTY_STRING, EMPTY_DATE } from '@/features/database/constants/emptyValues.constants';

export interface AdminDetail {
  _id: string;
  email: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAdminByIdResponse {
  success: boolean;
  data?: AdminDetail;
  error?: string;
}

export async function getAdminByIdAction(adminId: string): Promise<GetAdminByIdResponse> {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admins');

    const admin = await adminsCollection.findOne(
      { _id: new ObjectId(adminId) },
      { projection: { password: 0 } }
    );

    if (!admin) {
      return {
        success: false,
        error: 'Administrador no encontrado',
      };
    }

    const result: AdminDetail = {
      _id: admin._id.toString(),
      email: admin.email || EMPTY_STRING,
      isEnabled: admin.isEnabled !== undefined ? admin.isEnabled : true,
      createdAt: admin.createdAt ? new Date(admin.createdAt) : EMPTY_DATE,
      updatedAt: admin.updatedAt ? new Date(admin.updatedAt) : EMPTY_DATE,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    return {
      success: false,
      error: 'Error al cargar el administrador',
    };
  }
}

