import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
    const { id } = useParams();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            user_name: "",
            email: "",
            phone: "",
            nric: ""
        },
        validationSchema: yup.object({
            user_name: yup.string().trim()
                .min(3, 'User Name must be at least 3 characters')
                .max(100, 'User Name must be at most 100 characters')
                .required('User Name is required'),
            email: yup.string().trim()
                .min(3, 'Email must be at least 3 characters')
                .max(50, 'Email must be at most 500 characters')
                .required('Email is required'),
            phone: yup.string().trim()
                .min(3, 'Email must be at least 3 characters')
                .max(50, 'Email must be at most 500 characters')
                .required('Email is required'),
            nric: yup.string().trim()
                .min(3, 'Email must be at least 3 characters')
                .max(50, 'Email must be at most 500 characters')
                .required('Email is required'),
        }),
        onSubmit: (data) => {
            data.user_name = data.name.trim();
            data.email = data.description.trim();
            data.phone = data.description.trim();
            data.nric = data.description.trim();
            http.post("/signup", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/events");
                });
        }
    });


    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Sign Up for Event
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                    <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="User Name"
                            name="user_name"
                            value={formik.values.user_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.user_name && Boolean(formik.errors.user_name)}
                            helperText={formik.touched.user_name && formik.errors.user_name}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Phone"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="NRIC"
                            name="nric"
                            value={formik.values.nric}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nric && Boolean(formik.errors.nric)}
                            helperText={formik.touched.nric && formik.errors.nric}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Sign Up
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default SignUp;
