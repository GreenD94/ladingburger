'use client';

import { Box, Skeleton, Stack } from '@mui/material';

export function OrderSkeleton() {
  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
        <Skeleton variant="rectangular" width={80} height={32} />
      </Stack>

      <Stack spacing={1} sx={{ mb: 2 }}>
        {[1, 2, 3].map((index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={24} height={24} />
            <Skeleton variant="text" width="70%" height={20} />
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <Skeleton variant="text" width="30%" height={24} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rectangular" width={100} height={36} />
          <Skeleton variant="rectangular" width={100} height={36} />
        </Stack>
      </Stack>
    </Box>
  );
}

