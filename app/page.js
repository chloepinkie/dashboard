"use client";

import { Box, Container, Typography, Paper } from '@mui/material';
import Image from "next/image";
import Login from './client/components/Login';
import ScrollingText from './client/components/ScrollingText';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="header" sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
        <Image
          src="/logos/LOFlogo.png"
          alt="Left On Friday Logo"
          width={568/2}
          height={89/2}
        />
      </Box>
      <Container component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Welcome to Left on Friday's 
          <br />
          Data Dashboard
        </Typography>
        <Typography variant="h5" paragraph align="center">
          Created by Chloe :)
        </Typography>
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Login onLoginSuccess={handleLoginSuccess} />
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
