import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Rating } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';

import { useFormik } from 'formik';
import * as yup from 'yup';

import './DataFeedbacks.css';

function EditDataFeedback() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [datafeedback, setDatafeedback] = useState(
        { name: "", ranking: 0, best: "", improvement: "", rating: 5 }
    );
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);

    useEffect(() => {
        http.get(`/datafeedback/${id}`)
            .then((res) => {
                setDatafeedback(res.data);
                setRating(res.data.rating);
                setLoading(false);
            });
    }, []);

    const formik = useFormik({
        initialValues: datafeedback,
        enableReinitialize: true,
        validationSchema:
            yup.object({
                name: yup.string().trim().min(3, 'Name must be at least 3 characters')
                    .max(80, 'Name must be at most 100 characters')
                    .required('name is required'),
                ranking: yup.number()
                    .integer('Ranking must be an integer'),
                best: yup.string().trim().min(3, 'Your best portion must be at least 3 characters')
                    .max(500, 'Your best portion must be at most 500 characters')
                    .required('Description is required'),
                improvement: yup.string().trim().min(3, 'Your feedback must be at least 3 characters')
                    .max(500, 'Your feedback must be at most 500 characters')
                    .required('Description is required')
            }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.ranking = data.ranking;
            data.best = data.best.trim();
            data.improvement = data.improvement.trim();
            http.put(`/datafeedback/${id}`, data)
            .then((res) => {
                console.log(res.data);
                navigate("/datafeedback");
            });
        }
    }
    );

    const [open, setOpen] = useState(false);
    
    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const deleteDataFeedback = () => {
        http.delete(`/datafeedback/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/datafeedback");
            });
    }

    const handleStarClick = (starIndex) => {
        setRating(starIndex);
        formik.setFieldValue('ranking', starIndex);
    };
    const renderStars = () => {
        const stars = [];
        const currentRating = formik.values.ranking || rating;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i}
                    style={{ cursor: 'pointer', color: i <= currentRating ? '#ffc107' : '#e4e5e9' }}
                    onClick={() => formik.setFieldValue('ranking', i)}>
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
                {!loading && (
                    <Box component="form" onSubmit={formik.handleSubmit} style={{margin:'5px'}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4}>
                                <Typography>Name (From your account):</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField fullWidth margin="dense" autoComplete="off" label="Name" name="name"
                                    value={formik.values.name} />
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>How satisfied are you with the website?</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {renderStars(datafeedback.ranking)}
                                    <Typography component="span" sx={{ ml: 2 }}>
                                        {formik.values.ranking} Star{formik.values.ranking > 1 ? 's' : ''}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>What do you find best?</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField fullWidth margin="dense" autoComplete="off" multiline minRows={2} label="Best Features" name="best"
                                    value={formik.values.best} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.best && Boolean(formik.errors.best)} helperText={formik.touched.best && formik.errors.best} />
                            </Grid>

                            <Grid item xs={4}>
                                <Typography>What can be improved?</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField fullWidth margin="dense" autoComplete="off" multiline minRows={2} label="Improvements" name="improvement"
                                    value={formik.values.improvement} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.improvement && Boolean(formik.errors.improvement)} helperText={formik.touched.improvement && formik.errors.improvement} />
                            </Grid>

                            <Grid item xs={12}>
                                <Button variant="contained" type="submit" style={{ backgroundColor: '#0084ff' }}> Update</Button>
                                <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}> Delete </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                </div>
                
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle> Delete your feedback </DialogTitle>
                    <DialogContent>
                        <DialogContentText> Are you sure you want to delete this feedback? </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="inherit" onClick={handleClose}> Cancel </Button>
                        <Button variant="contained" color="error" onClick={deleteDataFeedback}> Delete </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>

    )
}

export default EditDataFeedback