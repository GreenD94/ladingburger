'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import NoteIcon from '@mui/icons-material/Note';
import { Order } from '@/features/database/types';

interface OrderNotesProps {
  order: Order;
  onNotesChange: (orderId: string, notes: string) => void;
  updating?: boolean;
}

export const OrderNotes: React.FC<OrderNotesProps> = ({
  order,
  onNotesChange,
  updating = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(order.internalNotes || '');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSave = () => {
    onNotesChange(order._id!.toString(), notes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(order.internalNotes || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Notas Internas (Solo visible para staff)
            </Typography>
            <TextField
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre este pedido..."
              fullWidth
              sx={{ minHeight: isMobile ? 100 : 80 }}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={handleCancel}
                variant="outlined"
                startIcon={<CancelIcon />}
                sx={{ minHeight: isMobile ? 44 : 36 }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={updating}
                sx={{ minHeight: isMobile ? 44 : 36 }}
              >
                Guardar
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <NoteIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" color="text.secondary">
              Notas Internas
            </Typography>
          </Stack>
          <IconButton
            onClick={() => setIsEditing(true)}
            size="small"
            sx={{ minWidth: isMobile ? 44 : 40, minHeight: isMobile ? 44 : 40 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>
        {order.internalNotes ? (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
            {order.internalNotes}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
            No hay notas para este pedido
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

