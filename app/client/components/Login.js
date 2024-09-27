import { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
          // User is approved, store the token and call the success callback
          localStorage.setItem('authToken', data.token);
          onLoginSuccess();
        } else {
          // User is not approved, show message
          setMessage(data.message || 'Registration request sent. Please wait for admin approval.');
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