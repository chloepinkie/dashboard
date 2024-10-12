import { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.isApproved) {
          // User is approved, store the token and redirect to dashboard
          localStorage.setItem('authToken', data.token);
          router.push('/client/dashboard');
        } else {
          // User is not approved, show message and redirect to success page
          setMessage(data.message || 'Registration request sent. Please wait for admin approval.');
          setTimeout(() => router.push('/client/auth/success'), 3000);
        }
      } else {
        throw new Error(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Login/Registration error:', error);
      setMessage(error.message || 'An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Login or Register
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading}
        sx={{ mt: 2, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
      </Button>
      {message && (
        <Typography color="textSecondary" align="center">
          {message}
        </Typography>
      )}
    </Box>
  );
}