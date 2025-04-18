'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Container } from '@mui/material';

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
        const response = await fetch('/api/admin/me', {
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setAdmin(data);
      } catch (error: unknown) {
        console.error('Fetch admin error:', error);
        router.push('/login');
      }
    };

    fetchAdmin();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error: unknown) {
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