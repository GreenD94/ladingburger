'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../../models/admin.model';
import { redirect } from 'next/navigation';

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
      return { error: 'No token provided' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    const admin = await AdminModel.findById(decoded.id).select('-password');

    if (!admin) {
      return { error: 'Admin not found' };
    }

    return { admin };
  } catch (error: unknown) {
    console.error('Get current admin error:', error);
    return { error: 'Invalid token' };
  }
}

export async function requireAuth() {
  const result = await getCurrentAdmin();
  if ('error' in result) {
    redirect('/login');
  }
  return result.admin;
} 