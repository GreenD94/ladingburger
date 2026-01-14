'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Ordenar', path: '/create-order' },
  { label: 'Tu Pedido', path: '/orders' }
];

const DRAWER_WIDTH = 250;

export const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: DRAWER_WIDTH, pt: 2 }}>
      <List>
        {NAV_ITEMS.map((item) => {
          const isItemActive = isActive(item.path);
          return (
            <ListItem 
              component="button"
              key={item.label}
              onClick={() => {
                router.push(item.path);
                setMobileOpen(false);
              }}
              sx={{
                bgcolor: isItemActive ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 0, 0.15)',
                },
                width: '100%',
                textAlign: 'left',
                border: 'none',
                cursor: 'pointer',
                p: 2,
              }}
            >
              <ListItemText 
                primary={item.label}
                sx={{
                  color: isItemActive ? '#FF6B00' : '#2C1810',
                  fontWeight: isItemActive ? 700 : 400,
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'rgba(255, 248, 240, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        maxWidth: '1200px',
        width: '100%',
        mx: 'auto',
        px: { xs: 2, md: 4 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #FF6B00, #E55C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
            onClick={() => router.push('/')}
          >
            SABOREA
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const isItemActive = isActive(item.path);
            return (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => router.push(item.path)}
                sx={{
                  color: isItemActive ? '#FF6B00' : '#2C1810',
                  fontWeight: isItemActive ? 700 : 400,
                  position: 'relative',
                  '&:hover': {
                    color: '#FF6B00',
                  },
                  '&::after': isItemActive ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '2px',
                    bgcolor: '#FF6B00',
                    borderRadius: '2px',
                  } : {},
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            display: { md: 'none' },
            color: '#2C1810',
            position: 'absolute',
            right: 16,
          }}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            bgcolor: '#FFF8F0',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

