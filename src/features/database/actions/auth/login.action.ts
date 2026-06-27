'use server';

import { cookies } from 'next/headers';
import { apiPost } from '@/features/api/utils/apiClient.util';
import { TokenFromAPI } from '@/features/api/types/api.type';

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
    const token = await apiPost<TokenFromAPI>('/api/v1/auth/login', { email, password });

    const cookieStore = await cookies();
    cookieStore.set('adminToken', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error && error.message.includes('401')) {
      return { success: false, error: 'Credenciales inválidas' };
    }
    return { success: false, error: 'Error al iniciar sesión' };
  }
}
