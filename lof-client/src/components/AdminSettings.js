import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Divider, IconButton, Snackbar, CircularProgress, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdminSettings({ onClose, onUpload }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isScrapingAllData, setIsScrapingAllData] = useState(false);
  const [shopMyToken, setShopMyToken] = useState('');
  const [daysToDelete, setDaysToDelete] = useState('');
  const [isDeletingData, setIsDeletingData] = useState(false);

  useEffect(() => {
    // Load the token from localStorage when the component mounts
    const storedToken = localStorage.getItem('shopMyToken');
    if (storedToken) {
      setShopMyToken(storedToken);
    }
  }, []);


  const handleDaysToDeleteChange = (event) => {
    setDaysToDelete(event.target.value);
  };

  const handleDeleteRecentData = async () => {
    if (!daysToDelete || isNaN(daysToDelete) || daysToDelete <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid number of days',
        severity: 'error'
      });
      return;
    }

    setIsDeletingData(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/scrape/delete-recent-csv-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ days: parseInt(daysToDelete) })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete recent data');
      }

      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting recent data:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete recent data: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsDeletingData(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleScrapeAllData = async () => {
    if (!shopMyToken) {
      setSnackbar({
        open: true,
        message: 'Please enter a ShopMy Auth Token',
        severity: 'error'
      });
      return;
    }

    setSnackbar({
      open: true,
      message: 'Started scraping all ShopMy data. Please wait.',
      severity: 'info'
    });
    setIsScrapingAllData(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/scrape/shopmy/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ token: shopMyToken })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to scrape all data');
      }
    } catch (error) {
      console.error('Error scraping all data:', error);
      setSnackbar({
        open: true,
        message: `Failed to start scraping all data: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setSnackbar({
        open: true,
        message: 'Finished scraping all ShopMy data',
        severity: 'success'
      });
      setIsScrapingAllData(false);
    }
  };

  const handleShopMyTokenChange = (event) => {
    setShopMyToken(event.target.value);
  };

  const handleSaveShopMyToken = () => {
    localStorage.setItem('shopMyToken', shopMyToken);
    setSnackbar({
      open: true,
      message: 'ShopMy Auth Token saved successfully',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: 'background.paper', 
      borderRadius: 2, 
      p: 3 
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h2">
          Admin Settings
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          ShopMy Auth Token
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={shopMyToken}
          onChange={handleShopMyTokenChange}
          placeholder="Enter ShopMy Auth Token"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSaveShopMyToken}
          sx={{ mr: 2 }}
        >
          Save Token
        </Button>
      </Box>
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
          onClick={handleScrapeAllData}
          disabled={isScrapingAllData}
        >
          {isScrapingAllData ? <CircularProgress size={24} /> : 'Scrape ShopMy Data'}
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Delete Recent Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Delete the most recent CsvData entries by specifying the number of days.
        </Typography>
        <TextField
          type="number"
          fullWidth
          variant="outlined"
          value={daysToDelete}
          onChange={handleDaysToDeleteChange}
          placeholder="Enter number of days"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleDeleteRecentData}
          disabled={isDeletingData}
          color="error"
        >
          {isDeletingData ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Delete Recent Data'
          )}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
