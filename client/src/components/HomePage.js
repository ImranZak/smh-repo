import React from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h2" gutterBottom>Singapore Management Hub</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <img src="placeholder.jpg" alt="Community" style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h4">Uniting Communities</Typography>
          <Typography>Our project thrives on fostering strong interactions and connections within diverse local communities.</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h4">Easy Monitoring</Typography>
          <Typography>Keep track of your personal and community resource usage effortlessly with our real-time dashboard.</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h4">Community Engagements</Typography>
          <Typography>Experience the vibrancy of community life through a variety of local events and gatherings.</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
