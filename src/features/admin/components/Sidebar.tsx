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
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { logout } from '@/features/database/actions/auth/logout';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const menuItems = [
    { text: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'Menu', icon: <MenuIcon />, path: '/admin/menu' },
    { text: 'Business', icon: <BusinessIcon />, path: '/admin/business' },
    { text: 'Admin', icon: <AdminIcon />, path: '/admin/settings' },
    { text: 'Users', icon: <UsersIcon />, path: '/admin/users' },
  ];

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
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
            <ListItemButton onClick={() => router.push(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}; 