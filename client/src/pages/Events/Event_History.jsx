import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import http from '../../http';
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

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                My Event History
            </Typography>
            {events.length > 0 ? (
                <Grid container spacing={2}>
                    {events.map((eventSignUp) => (
                        <Grid item xs={12} key={eventSignUp.id}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">{eventSignUp.event.name}</Typography>
                                <Typography variant="body1">{eventSignUp.event.description}</Typography>
                                <Typography variant="body2" color="textSecondary">Status: {eventSignUp.event.status}</Typography>
                                <Typography variant="body2" color="textSecondary">Signed Up At: {new Date(eventSignUp.createdAt).toLocaleString()}</Typography>
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
