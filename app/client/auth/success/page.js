"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, CircularProgress } from '@mui/material';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login Successful!
      </Typography>
      <Typography variant="body1" paragraph>
        You have successfully logged in. Redirecting to dashboard...
      </Typography>
      <CircularProgress />
    </Box>
  );
}