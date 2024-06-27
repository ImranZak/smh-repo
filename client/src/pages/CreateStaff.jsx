import React from 'react'
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik'; 
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup'; 
import http from '../http';

function CreateStaff() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { 
            name: "", 
            email: "",
            phoneNumber: "",
            password: "",
            role: "",
            department: ""
        },
        validationSchema: yup.object({
            name: yup.string().trim()
            .min(3, 'Name must be at least 3 characters')
            .max(100, 'Name must be at most 100 characters')
            .required('Name is required'),
            email: yup.string().trim()
            .min(3, 'Email must be at least 3 characters')
            .max(100, 'Email must be at most 100 characters')
            .email().matches(/^[a-zA-Z0-9._%+-]+@smhstaff\.com$/, 'Email must be from @smhstaff.com')
            .required('Email is required'),
            phoneNumber: yup.string().trim()
            .matches(/^(?:\+\d{1,3})?\d{8,10}$/, 'Phone number must be 8-10 digits with valid country code if international')
            .required('Phone number is required'),
            password: yup.string().trim()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&+=]{8,100}$/, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces")
            .required('Password is required'),
            role: yup.string().trim()
            .min(3, 'Role must be at least 3 characters')
            .max(500, 'Role must be at most 500 characters')
            .required('Role is required'),
            department: yup.string().trim()
            .min(2, 'Department must be at least 2 characters')
            .max(500, 'Department must be at most 500 characters')
            .required('Department is required')
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.phoneNumber = data.phoneNumber.trim();
            data.password = data.password.trim();
            data.role = data.role.trim();
            data.department = data.department.trim();
            http.post("/staff", data).then((res) => {
                console.log(res.data);
                navigate("/staff");
            });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Create Staff
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
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
                    label="Password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Department"
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.department && Boolean(formik.errors.department)}
                    helperText={formik.touched.department && formik.errors.department}
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
                    type="submit"
                    color="neutral"
                    onClick={() => navigate("/staff")}>
                    Back
                </Button>
            </Box>
        </Box>
    )
}

export default CreateStaff