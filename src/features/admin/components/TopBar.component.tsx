'use client';

import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/database/actions/auth/logout.action';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';

interface TopBarProps {
  onMenuClick: () => void;
  isMobile?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, isMobile = false }) => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { xs: 'block', sm: isMobile ? 'block' : 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {t('adminDashboard')}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          {t('logout')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

