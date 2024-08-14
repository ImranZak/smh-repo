import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import './DataFeedbacks.css';

function AddDatafeedback() {

    const navigate = useNavigate();
    const [rating, setRating] = useState(5); // State to keep track of rating

    const formik = useFormik({
        initialValues: {
            name: "",
            ranking: 5,
            best: "",
            improvement: ""
        },
        validationSchema: yup.object({
            name: yup.string().trim().min(3, 'Name must be at least 3 characters')
                .max(80, 'Name must be at most 80 characters')
                .required('Name is required'),
            ranking: yup.number() // Ensure ranking is a number
                .min(0, 'Ranking must be at least 0')
                .max(5, 'Ranking must be at most 5')
                .required('Ranking is required'),
            best: yup.string().trim().min(3, 'Your best portion must be at least 3 characters')
                .max(500, 'Your best portion must be at most 500 characters')
                .required('Best portion is required'),
            improvement: yup.string().trim().min(3, 'Your feedback must be at least 3 characters')
                .max(500, 'Your feedback must be at most 500 characters')
                .required('Improvement is required')
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.best = data.best.trim();
            data.improvement = data.improvement.trim();
            console.log("Data to be sent:", data);
            http.post('/datafeedback', data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/datafeedback");
                })
                .catch((err) => {
                    if (err.response && err.response.data) {
                        // Log or display the error message from the server
                        console.error("Error from server:", err.response.data.errors);
                        // Optionally, display this error to the user in the UI
                        alert(`Error: ${err.response.data.errors.join(', ')}`);
                    } else {
                        console.error("Unknown error occurred:", err);
                    }
                });
        }
    });

    // Function to handle star click
    const handleStarClick = (starIndex) => {
        setRating(starIndex);
        formik.setFieldValue('ranking', starIndex);
    };

    // Function to render stars
    const renderStars = () => {
        const stars = [];
        const currentRating = formik.values.ranking || rating;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i}
                    style={{ cursor: 'pointer', color: i <= currentRating ? '#ffc107' : '#e4e5e9' }}
                    onClick={() => handleStarClick(i)}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div style={{ width: '100%', backgroundColor: 'white' }}>
            <Box sx={{ flexGrow: 1 }}>
                <div className='feedback-header'>
                    <Typography variant="h5" sx={{
                        my: 2, color: 'white', width: '100%', fontWeight: 'bold', fontStyle: 'Roboto', alignItems: 'center'
                    }}> Feedback Form</Typography>
                </div>

                <div style={{ backgroundColor: 'white', padding: '10px', marginleft: '5px' }}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4}>
                                <Typography>Name (From your account):</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField fullWidth margin="dense" autoComplete="off" label="Name" name="name"
                                    value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name} />
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>How satisfied are you with the website?</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {renderStars()}
                                    <Typography component="span" sx={{ ml: 2 }}>
                                        {rating} Star{rating > 1 ? 's' : ''}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>What do you find best?</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField fullWidth margin="dense" autoComplete="off" multiline minRows={2} label="Best Features" name="best"
                                    value={formik.values.best} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    error={formik.touched.best && Boolean(formik.errors.best)}
                                    helperText={formik.touched.best && formik.errors.best} />
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>What can be improved?</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField fullWidth margin="dense" autoComplete="off" multiline minRows={2} label="Improvements" name="improvement"
                                    value={formik.values.improvement} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    error={formik.touched.improvement && Boolean(formik.errors.improvement)}
                                    helperText={formik.touched.improvement && formik.errors.improvement} />
                            </Grid>
                            <div className='feedback-buttons' style={{ textAlign: 'right', alignContent: 'right' }}>
                                <Grid item xs={12} >
                                    <Button variant="contained" style={{ backgroundColor: '#208130', alignContent: 'right' }} type="submit">Submit</Button>
                                </Grid>
                            </div>
                        </Grid>
                    </Box>
                </div>
            </Box>
        </div>
    );
}

export default AddDatafeedback;