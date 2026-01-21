'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { ObjectId } from 'mongodb';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export interface UpdateAdminInput {
  email?: string;
  isEnabled?: boolean;
}

export interface UpdateAdminResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function updateAdminAction(
  adminId: string,
  updates: UpdateAdminInput
): Promise<UpdateAdminResponse> {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admins');

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates.email !== undefined) {
      const normalizedEmail = updates.email.trim().toLowerCase();
      if (normalizedEmail === EMPTY_STRING) {
        return {
          success: false,
          error: 'El email es requerido',
        };
      }

      const existingAdmin = await adminsCollection.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
        _id: { $ne: new ObjectId(adminId) },
      });

      if (existingAdmin) {
        return {
          success: false,
          error: 'Ya existe un administrador con este email',
        };
      }

      updateData.email = normalizedEmail;
    }

    if (updates.isEnabled !== undefined) {
      updateData.isEnabled = updates.isEnabled;
    }

    const result = await adminsCollection.updateOne(
      { _id: new ObjectId(adminId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'Administrador no encontrado',
      };
    }

    return {
      success: true,
      message: 'Administrador actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error updating admin:', error);
    return {
      success: false,
      error: 'Error al actualizar el administrador',
    };
  }
}

