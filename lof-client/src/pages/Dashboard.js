import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Box, Container, Paper, CircularProgress, Button, Modal, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import DateRangeSelector from '../components/DateRangeSelector';
import DataVisualizer from '../components/DataVisualizer';
import Settings from '../components/Settings';
import LOFlogo from '../assets/logos/LOFlogo.png';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [error, setError] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!dateRange.start || !dateRange.end) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = new URL(`${process.env.REACT_APP_API_URL}/api/data/dashboard-data`);
      url.searchParams.append('startDate', dateRange.start);
      url.searchParams.append('endDate', dateRange.end);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(`Failed to fetch dashboard data: ${error.message}`);
      if (error.message === 'No authentication token found') {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, navigate]);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchData();
    }
  }, [fetchData, dateRange]);

  const handleDateRangeChange = (newDateRange) => {
    console.log('Date range changed:', newDateRange);
    setDateRange(newDateRange);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  const userType = localStorage.getItem('userType');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Box component="header" sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'center', sm: 'center' }}
          spacing={2}
        >
          <img src={LOFlogo} alt="Left On Friday Logo" width={284} height={44.5} />
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
          >
            {userType === 'admin' && (
              <Button onClick={handleOpenSettings} variant="outlined">
                Admin Settings
              </Button>
            )}
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Your Data Dashboard
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
          <DateRangeSelector onChange={handleDateRangeChange} />
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ my: 4 }}>{error}</Typography>
          ) : (
            <DataVisualizer data={dashboardData} dateRange={dateRange} />
          )}
        </Paper>
      </Container>

      {/* Settings Modal */}
      <Modal
        open={openSettings}
        onClose={handleCloseSettings}
        aria-labelledby="settings-modal"
        aria-describedby="settings-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 0,
          outline: 'none',
          borderRadius: 2,
        }}>
          <Settings onClose={handleCloseSettings} onUpload={fetchData} />
        </Box>
      </Modal>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
