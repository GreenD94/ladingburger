'use client';

import { Box, Stack, Skeleton } from '@mui/material';
import { OrderSkeleton } from './OrderSkeleton';

export function OrderSkeletonList() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Title and Refresh Timer Skeleton */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </Stack>

      {/* Tabs Skeleton */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Skeleton key={index} variant="rectangular" width={120} height={48} />
        ))}
      </Stack>

      {/* Order Skeletons */}
      {[1, 2, 3, 4, 5].map((index) => (
        <OrderSkeleton key={index} />
      ))}
    </Box>
  );
} 