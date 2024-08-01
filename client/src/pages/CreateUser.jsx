import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik'; 
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup'; 
import http from '../http';

function CreateUser() {
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: { 
            name: "", 
            email: "",
            birthDate: "",
            phoneNumber: "",
            mailingAddress: "",
            password: ""
        },
        validationSchema: yup.object({
            name: yup.string()
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            birthDate: yup
                .date()
                .min(new Date().getFullYear() - 100, `Maximum birth year is ${new Date().getFullYear() - 100}`)
                .max(new Date().getFullYear() - 12, `Minimum birth year is ${(new Date().getFullYear() - 13)}`)
                .required(),
            email: yup.string()
                .email('Invalid email format')
                .max(100, 'Email must be at most 100 characters')
                .required('Email is required'),
            phoneNumber: yup.string()
                .max(20, 'Phone number must be at most 20 characters')
                .matches(/^(?:\+\d{1,3})?\d{8,10}$/, 'Phone number must be 8-10 digits with valid country code if international')
                .required('Phone number is required'),
            mailingAddress: yup.string()
                .max(100, 'Home address must be at most 100 characters')
                .required('Home address is required'),
            password: yup.string()
                .max(100, 'Password must be at most 100 characters')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,100}$/, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces")
                .required('Password is required')
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.birthDate = data.birthDate
            data.email = data.email.trim();
            data.phoneNumber = data.phoneNumber.trim();
            data.mailingAddress = data.mailingAddress.trim();
            data.password = data.password.trim();
            http.post("/user", data).then((res) => {
                console.log(res.data);
                navigate("/users");
            });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Create User
            </Typography>
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
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        )
                    }}
                />
                <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}>
                    Create
                </Button>
                <Button
                    sx={{ mt: 2, ml: 2 }}
                    variant="contained"
                    color="neutral"
                    onClick={() => navigate("/users")}>
                    Back
                </Button>
            </Box>
        </Box>
    )
}

export default CreateUser