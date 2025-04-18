import { Box, IconButton, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface RefreshTimerProps {
  timeLeft: number;
  isDisabled: boolean;
  onRefresh: () => void;
}

export function RefreshTimer({ timeLeft, isDisabled, onRefresh }: RefreshTimerProps) {
  const progress = (timeLeft / 60) * 100;

  const handleClick = () => {
    if (!isDisabled) {
      onRefresh();
    }
  };

  return (
    <Box 
      onClick={handleClick}
      sx={{ 
        position: 'relative', 
        display: 'inline-flex', 
        alignItems: 'center',
        cursor: isDisabled ? 'default' : 'pointer'
      }}
    >
      <IconButton
        disabled={isDisabled}
        sx={{
          color: isDisabled ? 'text.disabled' : 'primary.main',
          '&:hover': {
            backgroundColor: isDisabled ? 'transparent' : 'primary.light',
          },
        }}
      >
        <AccessTimeIcon />
      </IconButton>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={40}
          thickness={4}
          sx={{
            color: isDisabled ? 'text.disabled' : 'primary.main',
            position: 'absolute',
          }}
        />
      </Box>
    </Box>
  );
} 