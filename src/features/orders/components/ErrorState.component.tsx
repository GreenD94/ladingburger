import { Box, Typography, Container } from '@mui/material';

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => (
  <Container>
    <Box py={4}>
      <Typography color="error">{message}</Typography>
    </Box>
  </Container>
);

