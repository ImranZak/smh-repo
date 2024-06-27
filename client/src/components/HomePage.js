import React from 'react';
import { Container, Typography, Grid, Button, Card, CardContent, CardMedia } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia
              component="img"
              alt="Community"
              height="200"
              image="/path/to/your/image1.jpg" // Update this path
              title="Community"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Uniting Communities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our project thrives on fostering strong interactions and connections within diverse local communities.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia
              component="img"
              alt="Monitoring"
              height="200"
              image="/path/to/your/image2.jpg" // Update this path
              title="Monitoring"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Easy Monitoring
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep track of your personal and community resource usage effortlessly with our real-time dashboard.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardMedia
              component="img"
              alt="Engagements"
              height="200"
              image="/path/to/your/image3.jpg" // Update this path
              title="Engagements"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Community Engagements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Experience the vibrancy of community life through a variety of local events and gatherings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
