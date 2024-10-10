"use client";

import { useEffect, useState } from 'react';
import { Typography, Box, Container, Paper, CircularProgress, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import ScrollingText from '../client/components/ScrollingText';
import CSVUpload from '../components/CSVUpload';
import DateRangeSelector from '../components/DateRangeSelector';
import DataVisualizer from '../components/DataVisualizer';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [csvData, setCSVData] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/client/auth/signin');
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  async function fetchData() {
    try {
      const response = await fetch('/api/dashboard-data');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      router.push('/client/auth/error?error=' + encodeURIComponent('Failed to fetch dashboard data'));
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleCSVUpload = (parsedData) => {
    setCSVData(parsedData);
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

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
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleLogout}
          sx={{ ml: 2 }}
        >
          Logout
        </Button>
      </Box>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Left on Friday Data Dashboard
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard Overview
          </Typography>
          <CSVUpload onUpload={handleCSVUpload} />
          <DateRangeSelector onChange={handleDateRangeChange} />
          {csvData && (
            <DataVisualizer 
              data={csvData} 
              dateRange={dateRange}
            />
          )}
        </Paper>
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