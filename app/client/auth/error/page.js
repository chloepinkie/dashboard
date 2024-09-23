'use client';

import { useSearchParams } from 'next/navigation';
import { Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Authentication Error
      </Typography>
      <Typography variant="body1" paragraph>
        {error || 'An unknown error occurred'}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/')}>
        Go Back to Login
      </Button>
    </Box>
  );
}