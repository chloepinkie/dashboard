import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container component="main" sx={{ flex: 1, py: 4 }}>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </Container>
        <Box component="footer" sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Typography align="center" sx={{ color: 'primary.contrastText' }}>
            © 2024 Left On Friday. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Router>
  );
}

export default App;