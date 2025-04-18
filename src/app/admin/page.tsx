'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Container } from '@mui/material';
import { getCurrentAdmin } from '@/features/database/actions/auth/getCurrentAdmin';
import { logout } from '@/features/database/actions/auth/logout';

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

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!admin) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        <Typography variant="body1">
          Welcome, {admin.email}
        </Typography>
      </Box>
    </Container>
  );
} 