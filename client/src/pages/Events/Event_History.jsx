import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import http from '../../http';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EventHistory() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        http.get("/eventHistory")
            .then((res) => {
                setEvents(res.data);
            })
            .catch((error) => {
                console.error('Error fetching event history:', error);
                toast.error('Failed to fetch event history');
            });
    }, []);
    
    const handleCancelSignUp = (signUpId) => {
        http.delete(`/eventHistory/${signUpId}`)
            .then(() => {
                toast.success("Sign-up cancelled successfully");
                // Update the state to remove the cancelled sign-up from the UI
                setEvents(events.filter(eventSignUp => eventSignUp.id !== signUpId));
            })
            .catch((error) => {
                console.error('Error cancelling sign-up:', error);
                toast.error('Failed to cancel sign-up');
            });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                My Events
            </Typography>
            {events.length > 0 ? (
                <Grid container spacing={2}>
                    {events.map((eventSignUp) => (
                        <Grid item xs={12} key={eventSignUp.id}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">{eventSignUp.event.name}</Typography>
                                <Typography variant="body1">Date of Event: {format(new Date(eventSignUp.event.date), 'yyyy-MM-dd')}</Typography>
                                <Typography variant="body2" color="textSecondary">Status: {eventSignUp.event.status}</Typography>
                                <Typography variant="body2" color="textSecondary">Type: {eventSignUp.event.type}</Typography>
                                <Typography variant="body2" color="textSecondary">Signed Up On: {format(new Date(eventSignUp.createdAt), 'MMMM dd, yyyy').toLocaleString()}</Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleCancelSignUp(eventSignUp.id)}
                                >
                                    Cancel Sign-Up
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">You have not signed up for any events.</Typography>
            )}
            <ToastContainer />
        </Box>
    );
}

export default EventHistory;
