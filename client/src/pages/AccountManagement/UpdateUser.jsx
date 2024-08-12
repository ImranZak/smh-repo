import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik'; 
import * as yup from 'yup';
import http from '../../http';

function UpdateUser() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [user, setUser] = useState({
        name: "", 
        email: "",
        birthDate: "",
        phoneNumber: "",
        mailingAddress: "",
        password: ""
    });

    const [loading, setLoading] = useState(true);   

    useEffect(() => {
        http.get(`/user/${id}`).then((res) => {
            console.log(res.data);
            setUser(res.data); 
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup
                .string()
                .max(100, "Name must be at most 100 characters")
                .matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , .")
                .required("Name is required"),
            birthDate: yup
                .date()
                .min(new Date().getFullYear() - 100,`Maximum birth year is ${new Date().getFullYear() - 100}`)
                .max(new Date().getFullYear() - 12,`Minimum birth year is ${new Date().getFullYear() - 13}`)
                .nullable(),
            email: yup
                .string()
                .email("Invalid email format")
                .max(100, "Email must be at most 100 characters")
                .required("Email is required"),
            phoneNumber: yup
                .string()
                .max(20, "Phone number must be at most 20 characters")
                .matches(/^(?:\+\d{1,3})?\d{8,10}$/,"Phone number must be 8-10 digits with valid country code if international")
                .nullable(),
            mailingAddress: yup
                .string()
                .max(100, "Home address must be at most 100 characters")
                .nullable(),
        }),
        onSubmit: (data) => {
            http.put(`/user/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/users");
                })
                .catch((error) => {
                    console.error("Error submitting form:", error);
                });
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Update User
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ marginBottom: '5%' }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Birth Date"
                            name="birthDate"
                            type='date'
                            value={formik.values.birthDate || "dd/mm/yyyy"}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                            helperText={formik.touched.birthDate && formik.errors.birthDate}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Phone Number"
                            name="phoneNumber"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Mailing Address"
                            name="mailingAddress"
                            value={formik.values.mailingAddress}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            error={formik.touched.mailingAddress && Boolean(formik.errors.mailingAddress)}
                            helperText={formik.touched.mailingAddress && formik.errors.mailingAddress}
                        />
                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!formik.isValid || formik.isSubmitting}>
                            Update
                        </Button>
                        <Button
                            sx={{ mt: 2, ml: 2 }}
                            variant="contained"
                            color="neutral"
                            onClick={() => navigate("/users")}>
                            Back
                        </Button>
                    </Box>
                )
            }
        </Box>
    );
}

export default UpdateUser