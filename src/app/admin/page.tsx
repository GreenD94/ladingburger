'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';
import { getCurrentAdmin } from '@/features/database/actions/auth/getCurrentAdmin';

interface Admin {
  id: string;
  email: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const currentAdmin = await getCurrentAdmin();
        
        if (!currentAdmin) {
          router.push('/login');
          return;
        }

        setAdmin({
          id: currentAdmin._id,
          email: currentAdmin.email
        });
      } catch (error) {
        console.error('Fetch admin error:', error);
        router.push('/login');
      }
    };

    fetchAdmin();
  }, [router]);

  if (!admin) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {admin.email}
        </Typography>
        <Typography variant="body1">
          Select a module from the sidebar to get started.
        </Typography>
      </Box>
    </Container>
  );
} 