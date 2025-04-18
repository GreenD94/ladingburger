'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { getCurrentAdmin } from '@/features/database/actions/auth/getCurrentAdmin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentAdmin = await getCurrentAdmin();
console.log({currentAdmin});
        if (!currentAdmin) {

          router.push('/login');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
} 