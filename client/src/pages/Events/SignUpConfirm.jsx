import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import http from '../../http';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function SignUpConfirm() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/events'); // Adjust the route as necessary
    };
    return (
        
        <Box>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Sign Up Confirmed
                    </Typography>
                    <Typography variant="h6">
                        You have successfully signed up for the event!
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleGoBack}>
                        Back to Events
                    </Button>
                </Paper>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default SignUpConfirm;
