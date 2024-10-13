import React, { useState } from 'react';
import { Typography, Box, Button, Divider, IconButton, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import CSVUpload from './CsvUpload';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Settings({ onClose, onUpload }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCSVUpload = async (uploadedData, success, message) => {
    if (success) {
      console.log('CSV data uploaded:', uploadedData);
      setSnackbar({
        open: true,
        message: message || 'CSV uploaded successfully',
        severity: 'success'
      });
      onUpload(); // Refresh dashboard data
    } else {
      setSnackbar({
        open: true,
        message: message || 'Failed to upload CSV',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 500, 
      bgcolor: 'background.paper', 
      borderRadius: 2, 
      p: 3 
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h2">
          Settings
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upload CSV Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload your CSV file to update the dashboard data.
        </Typography>
        <CSVUpload onUpload={handleCSVUpload} />
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          width: '100%',
          '& .MuiSnackbarContent-root': {
            width: '100%',
            maxWidth: '600px',
          },
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
