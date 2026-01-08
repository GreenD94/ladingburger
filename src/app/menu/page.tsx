'use client';

import { Box } from '@mui/material';
import { MenuList } from '@/features/menu/components/MenuList';

export default function MenuPage() {
  return (
    <Box
      sx={{
        width: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
      }}
    >
      <Box sx={{ pt: '5px', px: '10px', pb: '5px' }}>
        <MenuList />
      </Box>
    </Box>
  );
}

