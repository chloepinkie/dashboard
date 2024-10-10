"use client";

import { useEffect, useState, useCallback } from 'react';
import { Typography, Box, Container, Paper, CircularProgress, Button, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import ScrollingText from '../components/ScrollingText';
import DateRangeSelector from '../../components/DateRangeSelector';
import SalesSection from '../../components/SalesSection';
import AffiliateSection from '../../components/AffiliateSection';
import CostSection from '../../components/CostSection';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('/api/dashboard-data', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        router.push('/client/auth/error?error=' + encodeURIComponent(error.message));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router, dateRange]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    router.push('/client/auth/signin');
  }, [router]);

  const handleSettings = useCallback(() => {
    router.push('/client/settings');
  }, [router]);

  const handleDateRangeChange = useCallback((newDateRange) => {
    setDateRange(newDateRange);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="header" sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image
          src="/logos/LOFlogo.png"
          alt="Left On Friday Logo"
          width={568/2}
          height={89/2}
        />
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSettings}
            sx={{ mr: 2 }}
          >
            Settings
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Left on Friday Data Dashboard
        </Typography>
        <DateRangeSelector 
          onChange={handleDateRangeChange} 
          initialStartDate={dateRange.start}
          initialEndDate={dateRange.end}
        />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <SalesSection data={data} dateRange={dateRange} />
          </Grid>
          <Grid item xs={12}>
            <AffiliateSection data={data} dateRange={dateRange} />
          </Grid>
          <Grid item xs={12}>
            <CostSection data={data} dateRange={dateRange} />
          </Grid>
        </Grid>
      </Container>
      <Box component="footer" sx={{ bgcolor: 'primary.main' }}>
        <ScrollingText />
        <Typography align="center" sx={{ p: 2, color: 'primary.contrastText' }}>
          © 2024 Left On Friday. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}