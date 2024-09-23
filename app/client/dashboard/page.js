"use client";

import { useEffect, useState } from 'react';
import { Typography, Box, Container, Paper, CircularProgress, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import ScrollingText from '../components/ScrollingText';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
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
        router.push('/auth/error?error=' + encodeURIComponent('Failed to fetch dashboard data'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
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
          {/* Add your SQL data visualizations here */}
          <Typography variant="body1">
            {JSON.stringify(data, null, 2)}
          </Typography>
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