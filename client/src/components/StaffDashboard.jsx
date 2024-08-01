import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GridLayout from 'react-grid-layout';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import Navbar from './Navbar'; // Make sure Navbar component is correctly imported

const StaffDashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', image: '' });
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/events');
        setEvents(result.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newEvent.name);
      formData.append('image', newEvent.image);

      const response = await axios.post('http://localhost:3000/api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEvents([...events, response.data]);
      setNewEvent({ name: '', image: '' });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleRemoveEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/events/${id}`);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleFileChange = (event) => {
    setNewEvent({ ...newEvent, image: event.target.files[0] });
  };

  return (
    <Container>
      <Navbar />
      <Typography variant="h4" gutterBottom>Staff Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="success" onClick={() => navigate('/dashboard')}>
            User Dashboard
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <Typography variant="h6">Upcoming Events</Typography>
        </Grid>
        {events.map((event, index) => (
          <Grid item xs={12} md={4} key={event.id}>
            <Card>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="body2">{event.name}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton color="secondary" onClick={() => handleRemoveEvent(event.id)}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <img src={event.imageUrl} alt={event.name} style={{ width: '100%', height: 'auto' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <Typography variant="h6">Add New Event</Typography>
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
          <input
            type="file"
            onChange={handleFileChange}
          />
          <Button variant="contained" color="primary" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Grid>
      </Grid>
      <footer style={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">© 2024 Staff Dashboard</Typography>
      </footer>
    </Container>
  );
};

export default StaffDashboard;
