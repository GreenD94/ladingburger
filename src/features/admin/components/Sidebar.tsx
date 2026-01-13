'use client';

import { useRouter } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ShoppingCart as OrdersIcon,
  Restaurant as MenuIcon,
  Business as BusinessIcon,
  Person as AdminIcon,
  Group as UsersIcon,
  Analytics as AnalyticsIcon,
  Palette as ThemeIcon,
  Settings as ConfigIcon,
} from '@mui/icons-material';
import { useLanguage } from '@/features/i18n/hooks/useLanguage';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant = 'persistent' }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage();

  const menuItems = [
    { text: t('analytics'), icon: <AnalyticsIcon />, path: '/admin/analytics' },
    { text: t('orders'), icon: <OrdersIcon />, path: '/admin/orders' },
    { text: t('menu'), icon: <MenuIcon />, path: '/admin/menu' },
    { text: t('business'), icon: <BusinessIcon />, path: '/admin/business' },
    { text: t('theme'), icon: <ThemeIcon />, path: '/admin/theme' },
    { text: t('config'), icon: <ConfigIcon />, path: '/admin/config' },
    { text: t('admin'), icon: <AdminIcon />, path: '/admin/settings' },
    { text: t('users'), icon: <UsersIcon />, path: '/admin/users' },
  ];

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: isMobile ? 'fixed' : 'relative',
          height: isMobile ? '100%' : 'auto',
          top: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          right: isMobile ? 0 : 'auto',
          bottom: isMobile ? 0 : 'auto',
          zIndex: isMobile ? 2 : 1
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => {
              router.push(item.path);
              if (isMobile) onClose();
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}; 