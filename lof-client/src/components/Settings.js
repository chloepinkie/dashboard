import React, { useState } from 'react';
import { Typography, Box, Button, Divider, IconButton, Snackbar, CircularProgress } from '@mui/material';
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
  const [isScrapingData, setIsScrapingData] = useState(false);
  const [isScrapingAllData, setIsScrapingAllData] = useState(false);

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

  const handleScrapeData = async () => {
    setIsScrapingData(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/scrape/shopmy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          userId: 'friends@leftonfriday.com',
          password: 'LEFTONFRIDAY2024-100'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setSnackbar({
            open: true,
            message: result.error,
            severity: 'warning'
          });
          onUpload(); // Refresh dashboard data with existing data
        } else {
          throw new Error(result.error || 'Failed to scrape data');
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Data scraped successfully',
          severity: 'success'
        });
        onUpload(); // Refresh dashboard data
      }
    } catch (error) {
      console.error('Error scraping data:', error);
      setSnackbar({
        open: true,
        message: `Failed to scrape data: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsScrapingData(false);
    }
  };

  const handleScrapeAllData = async () => {
    setIsScrapingAllData(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/scrape/shopmy/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          userId: 'friends@leftonfriday.com',
          password: 'LEFTONFRIDAY2024-100'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to scrape all data');
      }

      setSnackbar({
        open: true,
        message: 'Started scraping all ShopMy data. This may take a while.',
        severity: 'info'
      });
    } catch (error) {
      console.error('Error scraping all data:', error);
      setSnackbar({
        open: true,
        message: `Failed to start scraping all data: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsScrapingAllData(false);
    }
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
     {/*  <Divider sx={{ mb: 3 }} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upload CSV Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload your CSV file to update the dashboard data.
        </Typography>
        <CSVUpload onUpload={handleCSVUpload} />
      </Box> */}
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Scrape Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Fetch the latest data from the Shopmy API.
        </Typography>
        <Button
          variant="contained"
          onClick={handleScrapeData}
          disabled={isScrapingData || isScrapingAllData}
          sx={{ mr: 2 }}
        >
          {isScrapingData ? <CircularProgress size={24} /> : 'Scrape Recent Data'}
        </Button>
        <Button
          variant="contained"
          onClick={handleScrapeAllData}
          disabled={isScrapingData || isScrapingAllData}
        >
          {isScrapingAllData ? <CircularProgress size={24} /> : 'Scrape All ShopMy Data'}
        </Button>
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
