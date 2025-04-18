'use server';

import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import { findAdminByEmail } from '../../models/admin.model';

interface LoginResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
  };
  error?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const admin = await findAdminByEmail(email);

    if (!admin) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValidPassword = await admin.comparePassword(password);

    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = sign(
      { id: admin._id.toString(), email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return { 
      success: true, 
      data: { 
        id: admin._id.toString(),
        email: admin.email
      } 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
} 