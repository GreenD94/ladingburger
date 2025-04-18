'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  MenuItem, 
  Button, 
  Stack,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateValidationError } from '@mui/x-date-pickers/models';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const predefinedRanges = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last 6 months', value: 180 },
  { label: 'Last year', value: 365 },
];

export default function DateRangePicker({ onDateRangeChange }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedRange, setSelectedRange] = useState<number>(7);

  const handlePredefinedRangeChange = (days: number) => {
    setSelectedRange(days);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
    onDateRangeChange(start, end);
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Date Range
        </Typography>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          select
          label="Predefined Range"
          value={selectedRange}
          onChange={(e) => handlePredefinedRangeChange(Number(e.target.value))}
          sx={{ minWidth: 200 }}
        >
          {predefinedRanges.map((range) => (
            <MenuItem key={range.value} value={range.value}>
              {range.label}
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue: Date | null) => setStartDate(newValue)}
            maxDate={endDate || undefined}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: Date | null) => setEndDate(newValue)}
            minDate={startDate || undefined}
            maxDate={new Date()}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          onClick={handleCustomDateChange}
          sx={{ minWidth: 120 }}
        >
          Apply
        </Button>
      </Stack>
    </Paper>
  );
} 