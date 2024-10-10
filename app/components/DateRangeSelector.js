import { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';

export default function DateRangeSelector({ onChange, initialStartDate, initialEndDate }) {
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');

  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
    }
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    onChange({ start: startDate, end: endDate });
  }, [startDate, endDate, onChange]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
}