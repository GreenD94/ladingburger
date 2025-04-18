'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../../models/admin.model';

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Find admin by email
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return { error: 'Invalid credentials' };
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return { error: 'Invalid credentials' };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Set cookie
    const cookieStore = await cookies();
    await cookieStore.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 1 day in seconds
    });

    return { 
      success: true,
      admin: {
        id: admin._id,
        email: admin.email
      }
    };
  } catch (error: unknown) {
    console.error('Login error:', error);
    return { error: 'Server error' };
  }
} 