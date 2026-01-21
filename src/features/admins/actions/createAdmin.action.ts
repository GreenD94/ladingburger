'use server';

import { connectToDatabase } from '@/features/database/actions/connect.action';
import bcrypt from 'bcryptjs';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export interface CreateAdminInput {
  email: string;
  password: string;
}

export interface CreateAdminResponse {
  success: boolean;
  data?: { _id: string };
  error?: string;
}

export async function createAdminAction(input: CreateAdminInput): Promise<CreateAdminResponse> {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admins');

    const normalizedEmail = input.email.trim().toLowerCase();

    if (normalizedEmail === EMPTY_STRING) {
      return {
        success: false,
        error: 'El email es requerido',
      };
    }

    if (input.password.length < 6) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      };
    }

    const existingAdmin = await adminsCollection.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
    });

    if (existingAdmin) {
      return {
        success: false,
        error: 'Ya existe un administrador con este email',
      };
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const now = new Date();

    try {
      const result = await adminsCollection.insertOne({
        email: normalizedEmail,
        password: hashedPassword,
        isEnabled: true,
        createdAt: now,
        updatedAt: now,
      });

      return {
        success: true,
        data: {
          _id: result.insertedId.toString(),
        },
      };
    } catch (insertError) {
      if (insertError instanceof Error && insertError.message.includes('E11000')) {
        return {
          success: false,
          error: 'Ya existe un administrador con este email',
        };
      }
      throw insertError;
    }
  } catch (error) {
    console.error('Error creating admin:', error);
    return {
      success: false,
      error: 'Error al crear el administrador',
    };
  }
}

