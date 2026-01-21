'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface ResetPasswordInput {
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function resetPasswordAction(
  adminId: string,
  input: ResetPasswordInput
): Promise<ResetPasswordResponse> {
  try {
    if (input.newPassword.length < 6) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      };
    }

    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admins');

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);

    const result = await adminsCollection.updateOne(
      { _id: new ObjectId(adminId) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        error: 'Administrador no encontrado',
      };
    }

    return {
      success: true,
      message: 'Contraseña restablecida exitosamente',
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      error: 'Error al restablecer la contraseña',
    };
  }
}

