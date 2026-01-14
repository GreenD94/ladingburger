'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';
import { getCurrentAdmin } from '@/features/database/actions/auth/getCurrentAdmin.action';
import AnalyticsContainer from '@/features/admin/containers/AnalyticsContainer.container';
import { EMPTY_ADMIN } from '@/features/database/constants/emptyObjects.constants';

interface Admin {
  id: string;
  email: string;
}

const EMPTY_ADMIN_DASHBOARD: Admin = {
  id: '',
  email: '',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin>(EMPTY_ADMIN_DASHBOARD);
  const [isAdminLoaded, setIsAdminLoaded] = useState(false);

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
        setIsAdminLoaded(true);
      } catch (error) {
        console.error('Fetch admin error:', error);
        router.push('/login');
      }
    };

    fetchAdmin();
  }, [router]);

  if (!isAdminLoaded || admin.id === EMPTY_ADMIN_DASHBOARD.id) {
    return null;
  }

  return (
     <AnalyticsContainer />
  );
} 