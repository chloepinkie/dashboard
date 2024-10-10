"use client";

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Typography, Button, Box } from '@mui/material';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        An error occurred
      </Typography>
      <Typography variant="body1" gutterBottom>
        {error || 'Unknown error'}
      </Typography>
      <Button variant="contained" onClick={() => router.push('/')}>
        Go back to home
      </Button>
    </Box>
  );
}