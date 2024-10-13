import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import ScrollingText from '../components/ScrollingText';
import LOFlogo from '../assets/logos/LOFlogo.png';

export default function Home() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="header" sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 0 }}>
        <img
          src={LOFlogo}
          alt="Left On Friday Logo"
          width={284}
          height={44.5}
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
