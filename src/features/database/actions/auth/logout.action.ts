'use server';

import { cookies } from 'next/headers';

export async function logout() {
  try {
    const cookieStore = await cookies();
    await cookieStore.delete('adminToken');
    return { success: true };
  } catch (error: unknown) {
    console.error('Logout error:', error);
    return { error: 'Server error' };
  }
}

