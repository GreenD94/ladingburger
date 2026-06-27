'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiAuthGet } from '@/features/api/utils/apiClient.util';
import { UserFromAPI } from '@/features/api/types/api.type';

interface CurrentAdmin {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const EMPTY_CURRENT_ADMIN: CurrentAdmin = {
  _id: '',
  email: '',
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  try {
    const user = await apiAuthGet<UserFromAPI>('/api/v1/auth/me');
    return {
      _id: String(user.id),
      email: user.email,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      const cookieStore = await cookies();
      cookieStore.delete('adminToken');
    }
    return EMPTY_CURRENT_ADMIN;
  }
}

export async function requireAuth() {
  const result = await getCurrentAdmin();
  if (result._id === '' || result.email === '') {
    redirect('/login');
  }
  return result;
}
