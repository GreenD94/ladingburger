'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, useTheme, useMediaQuery, ThemeProvider } from '@mui/material';
import { getCurrentAdmin } from '@/features/database/actions/auth/getCurrentAdmin';
import { TopBar } from '@/features/admin/components/TopBar';
import { Sidebar } from '@/features/admin/components/Sidebar';
import { useSwipeable } from 'react-swipeable';
import { useAdminTheme } from '@/features/admin/hooks/useAdminTheme';
import { createAdminTheme } from '@/theme';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { themeMode } = useAdminTheme();
  const adminTheme = useMemo(() => createAdminTheme(themeMode), [themeMode]);
  const isMobile = useMediaQuery(adminTheme.breakpoints.down('sm'));

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [router, isMobile]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => isMobile && setSidebarOpen(false),
    onSwipedRight: () => isMobile && setSidebarOpen(true),
    trackMouse: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentAdmin = await getCurrentAdmin();
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
      <ThemeProvider theme={adminTheme}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
        {...swipeHandlers}
      >
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} />

        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.default',
            zIndex: sidebarOpen ? 1 : -1,
            transition: 'opacity 0.3s',
            opacity: sidebarOpen ? 0.5 : 0,
            display: isMobile ? 'block' : 'none',
          }}
          onClick={() => setSidebarOpen(false)}
        />

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          variant={isMobile ? 'temporary' : 'permanent'}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: {
              xs: '100%',
              sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)`,
            },
            ml: {
              xs: 0,
              sm: sidebarOpen ? '240px' : 0,
            },
            mt: '64px',
            bgcolor: 'background.default',
            minHeight: 'calc(100vh - 64px)',
            transition: adminTheme.transitions.create(['margin', 'width'], {
              easing: adminTheme.transitions.easing.sharp,
              duration: adminTheme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminLayoutInner;

