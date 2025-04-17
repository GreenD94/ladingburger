import React from 'react';
import { Button, Paper, Typography, CircularProgress, Box, Alert, Collapse, IconButton } from '@mui/material';
import { TestItem, TestData } from '../types/index';
import CloseIcon from '@mui/icons-material/Close';

interface TestResultProps {
  test: TestItem | null;
  result: { success: boolean; data?: TestData; error?: string; message?: string } | null;
  isLoading: boolean;
  onRun: () => void;
}

export const TestResult: React.FC<TestResultProps> = ({ test, result, isLoading, onRun }) => {
  const [showError, setShowError] = React.useState(true);

  React.useEffect(() => {
    if (result?.error || result?.message) {
      setShowError(true);
    }
  }, [result]);

  if (!test) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Select a test to run</Typography>
      </Paper>
    );
  }

  const errorMessage = result?.error || result?.message;

  return (
    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Test Details
      </Typography>
      <Typography variant="body1" gutterBottom>
        {test.description}
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={onRun}
        disabled={isLoading}
        sx={{ mt: 2, alignSelf: 'flex-start' }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Run Test'}
      </Button>

      {result && (
        <Box sx={{ mt: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            color={result.success ? 'success.main' : 'error.main'}
            sx={{ mb: 2 }}
          >
            {result.success ? 'Test Passed' : 'Test Failed'}
          </Typography>
          
          <Collapse in={showError && !result.success}>
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setShowError(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <Typography variant="body1" component="div">
                {errorMessage}
              </Typography>
            </Alert>
          </Collapse>
          
          {result.data && (
            <Paper 
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'grey.100',
                flex: 1,
                overflow: 'auto',
                maxHeight: '50vh'
              }}
            >
              <Typography variant="subtitle2" gutterBottom>Result Data:</Typography>
              <pre style={{ 
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </Paper>
          )}
        </Box>
      )}
    </Paper>
  );
}; 