import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, TextField } from '@mui/material';
import dayjs from 'dayjs';

export default function DateRangeSelector({ onChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    // Set default date range to last 7 days
    const end = dayjs();
    const start = end.subtract(8, 'day');
    setStartDate(start);
    setEndDate(end);
    onChange({ start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') });
  }, []);

  const handleDateChange = (newValue, isStart) => {
    if (isStart) {
      setStartDate(newValue);
    } else {
      setEndDate(newValue);
    }
    
    if (newValue && (isStart ? endDate : startDate)) {
      onChange({
        start: (isStart ? newValue : startDate).format('YYYY-MM-DD'),
        end: (isStart ? endDate : newValue).format('YYYY-MM-DD')
      });
    }
  };

  const handleLastNDays = (days) => {
    const end = dayjs();
    const start = end.subtract(days, 'day');
    setStartDate(start);
    setEndDate(end);
    onChange({ start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => handleDateChange(newValue, true)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => handleDateChange(newValue, false)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => handleLastNDays(7)}>Last 7 Days</Button>
          <Button variant="outlined" onClick={() => handleLastNDays(30)}>Last 30 Days</Button>
          <Button variant="outlined" onClick={() => handleLastNDays(90)}>Last 90 Days</Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
