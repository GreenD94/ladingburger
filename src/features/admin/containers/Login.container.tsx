'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '../components/LoginForm';
import { login } from '@/features/database/actions/auth/login';

export const LoginContainer: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
console.log({result});
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm 
      onLogin={handleLogin}
      error={error}
      loading={loading}
    />
  );
}; 