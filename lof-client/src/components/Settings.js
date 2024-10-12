"use client";

import { useState } from 'react';
import { Typography, Box, Container, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import CSVUpload from '../../../nodejs/lof-client/src/components/CsvUpload';
import ScrollingText from '../../../nodejs/lof-client/src/components/ScrollingText';

export default function SettingsPage() {
  const [csvData, setCSVData] = useState(null);
  const router = useRouter();

  const handleCSVUpload = async (parsedData) => {
    setCSVData(parsedData);
    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload CSV data');
      }

      const result = await response.json();
      alert(result.message);

      // Still store in localStorage for immediate use
      localStorage.setItem('csvData', JSON.stringify(parsedData));
    } catch (error) {
      console.error('Error uploading CSV data:', error);
      alert('Failed to upload CSV data. Please try again.');
    }
  };

  const handleBack = () => {
    router.push('/client/dashboard');
  };

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
          onClick={handleBack}
          sx={{ ml: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Settings
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Upload CSV Data
          </Typography>
          <CSVUpload onUpload={handleCSVUpload} />
          {csvData && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              CSV data uploaded successfully! {csvData.length} rows processed.
            </Typography>
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