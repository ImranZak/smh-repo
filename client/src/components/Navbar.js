import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" style={{ backgroundColor: '#2f4f4f' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>SINGAPORE</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>MANAGEMENT</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>HUB</span>
          </div>
        </Typography>
        <div>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/events')}>Events</Button>
          <Button color="inherit" onClick={() => navigate('/book-facilities')}>Book Facilities</Button>
          <Button color="inherit" onClick={() => navigate('/incident-reporting')}>Incident Reporting</Button>
          <Button color="inherit" onClick={() => navigate('/enviro-learn-community')}>EnviroLearn Community</Button>
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
