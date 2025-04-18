'use client';

import React from 'react';
import { Box } from '@mui/material';
import { OrderLog } from '@/features/database/types';
import { OrderStatusLabels } from '@/features/database/types';

interface StatusTimelineProps {
  logs: OrderLog[];
}

export function StatusTimeline({ logs }: StatusTimelineProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 2,
        overflowX: 'auto',
        py: 1,
        '&::-webkit-scrollbar': {
          height: 4,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.1)',
          borderRadius: 2,
        },
      }}
    >
      {logs.map((log, index) => (
        <React.Fragment key={log.createdAt.toString()}>
          <Box
            sx={{
              minWidth: 120,
              height: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                textAlign: 'center',
                px: 2,
                boxShadow: 2,
              }}
            >
              {OrderStatusLabels[log.status]}
            </Box>
            <Box
              sx={{
                mt: 1,
                fontSize: '0.75rem',
                color: 'text.secondary',
              }}
            >
              {new Date(log.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Box>
          </Box>
          {index < logs.length - 1 && (
            <Box
              sx={{
                width: 24,
                height: 2,
                backgroundColor: 'primary.main',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  transform: 'translateY(-50%)',
                  borderLeftColor: 'primary.main',
                },
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
} 