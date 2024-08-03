import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik'; 
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup'; 
import http from '../../http';

function CreateStaff() {
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState(false);

    // TODO: Create models for these
    const roles = [
        {
          value: 'Social Media Manager',
          label: 'Social Media Manager',
        },
        {
          value: 'Web Developer',
          label: 'Web Developer',
        },
        {
          value: 'System Admin',
          label: 'System Admin',
        },
        {
          value: 'HR Assistant',
          label: 'HR Assistant',
        },
    ];

    const departments = [
        {
          value: 'IT',
          label: 'IT',
        },
        {
          value: 'HR',
          label: 'HR',
        },
        {
          value: 'Admin',
          label: 'Admin',
        },
        {
          value: 'Publicity',
          label: 'Publicity',
        },
    ];

    const formik = useFormik({
        initialValues: { 
            name: "", 
            email: "",
            birthDate: "",
            phoneNumber: "",
            homeAddress: "",
            password: "",
            role: "",
            department: "",
            joinDate: ""
        },
        validationSchema: yup.object({
            name: yup.string()
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            birthDate: yup
                .date()
                .min(new Date().getFullYear() - 100, `Maximum birth year is ${new Date().getFullYear() - 100}`)
                .max(new Date().getFullYear() - 17, `Minimum birth year is ${(new Date().getFullYear() - 18)}`)
                .required(),
            email: yup.string()
                .email('Invalid email format')
                .max(100, 'Email must be at most 100 characters')
                .matches(/^[a-zA-Z0-9._%+-]+@smhstaff\.com$/, 'Email must be from @smhstaff.com').required()
                .required('Email is required'),
            phoneNumber: yup.string()
                .max(20, 'Phone number must be at most 20 characters')
                .matches(/^(?:\+\d{1,3})?\d{8,10}$/, 'Phone number must be 8-10 digits with valid country code if international')
                .required('Phone number is required'),
            homeAddress: yup.string()
                .max(100, 'Home address must be at most 100 characters')
                .required('Home address is required'),
            password: yup.string()
                .max(100, 'Password must be at most 100 characters')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&+=]{8,100}$/, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces. Special characters (@,#,$,%,^,&,+,=) are allowed")
                .required('Password is required'),
            role: yup.string()
                .required('Role is required'),
            department: yup.string()
                .required('Department is required'),
            joinDate: yup
            .date()
                .min('01/01/2002', `Maximum join year is 2002`)
                .max(new Date().getFullYear()+1, `Minimum join year is ${new Date().getFullYear()}`)
                .required()
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.birthDate = data.birthDate
            data.email = data.email.trim();
            data.phoneNumber = data.phoneNumber.trim();
            data.homeAddress = data.homeAddress.trim();
            data.password = data.password.trim();
            data.role = data.role.trim();
            data.department = data.department.trim();
            data.joinDate = data.joinDate
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
                    label="Home Address"
                    name="homeAddress"
                    value={formik.values.homeAddress}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.homeAddress && Boolean(formik.errors.homeAddress)}
                    helperText={formik.touched.homeAddress && formik.errors.homeAddress}
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
                <TextField
                    fullWidth
                    select
                    margin="dense"
                    autoComplete="off"
                    label="Role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                >
                    {roles.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    select
                    margin="dense"
                    autoComplete="off"
                    label="Department"
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.department && Boolean(formik.errors.department)}
                    helperText={formik.touched.department && formik.errors.department}
                >
                    {departments.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Join Date"
                    name="joinDate"
                    type='date'
                    value={formik.values.joinDate || "dd/mm/yyyy"}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.joinDate && Boolean(formik.errors.joinDate)}
                    helperText={formik.touched.joinDate && formik.errors.joinDate}
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
                    onClick={() => navigate("/staff")}>
                    Back
                </Button>
            </Box>
        </Box>
    )
}

export default CreateStaff