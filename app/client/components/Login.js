import { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Login successful. Please check your email for further instructions.');
      } else {
        throw new Error(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.message || 'An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Sign in or Register
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
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Continue with Email'}
      </Button>
      {message && (
        <Typography color="textSecondary" align="center">
          {message}
        </Typography>
      )}
    </Box>
  );
}