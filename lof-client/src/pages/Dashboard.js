"use client";

console.log('Dashboard page file loaded');

console.log('Dashboard page module loaded');

if (typeof window !== 'undefined') {
  console.log('This log will only appear in the browser');
}

import { useEffect, useState, useCallback } from 'react';
import { Typography, Box, Container, Paper, CircularProgress, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import ScrollingText from '../components/ScrollingText';
import CSVUpload from '../components/CsvUpload';
import DateRangeSelector from '../components/DateRangeSelector';
import DataVisualizer from '../components/DataVisualizer';
import ErrorBoundary from '../../nodejs/lof-client/src/components/ErrorBoundary';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/client/auth/signin');
    },
  });
  console.log('Status:')
  console.log('Session:', session);
  const fetchData = useCallback(async () => {
    if (!session || !dateRange.start || !dateRange.end) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL('/api/dashboard-data', window.location.origin);
      url.searchParams.append('startDate', dateRange.start);
      url.searchParams.append('endDate', dateRange.end);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.user.token}`
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
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, session]);

  useEffect(() => {
    if (status === "authenticated" && dateRange.start && dateRange.end) {
      fetchData();
    }
  }, [status, fetchData, dateRange]);

  useEffect(() => {
    console.log('DashboardPage component mounted');
  }, []);

  const handleDateRangeChange = (newDateRange) => {
    console.log('Date range changed:', newDateRange);
    setDateRange(newDateRange);
  };

  console.log('DashboardPage about to render');

  if (status === "loading") {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <Box component="header" sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image src="/logos/LOFlogo.png" alt="Left On Friday Logo" width={568/2} height={89/2} />
          <Button variant="contained" color="primary" onClick={() => signOut()} sx={{ ml: 2 }}>Logout</Button>
        </Box>

        {/* Main Content */}
        <Container component="main" sx={{ flex: 1, py: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Left on Friday Data Dashboard
          </Typography>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
            <CSVUpload onUpload={fetchData} />
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

        {/* Footer */}
        <Box component="footer" sx={{ bgcolor: 'primary.main' }}>
          <ScrollingText />
          <Typography align="center" sx={{ p: 2, color: 'primary.contrastText' }}>
            © 2024 Left On Friday. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ErrorBoundary>
  );
}
