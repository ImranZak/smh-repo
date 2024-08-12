import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { useFormik } from 'formik'; 
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify'; import 'react-toastify/dist/ReactToastify.css';

// FIX: Nullable values conflicting with form input values (this page and dashboard update page)
// TODO: Make validationSchema accept empty string values (using regex?)

function StaffProfile() {

    const { id } = useParams();

    const [staff, setStaff] = useState({
        name: "", 
        email: "",
        birthDate: "",
        phoneNumber: "",
        homeAddress: "",
        password: "",
        role: "",
        department: "",
        joinDate: ""
    });

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

    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const loadProfileForm = () => {
        http.get(`/staff/${id}`).then((res) => {
            console.log(res.data);
            setStaff(res.data);
            setLoading(false);
        });
    }

    useEffect(loadProfileForm, []);

    const profileFormik = useFormik({
        initialValues: staff,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup
                .string()
                .max(100, 'Name must be at most 100 characters')
                .matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , .")
                .required('Name is required'),
            birthDate: yup
                .date()
                .min(new Date().getFullYear() - 100, `Maximum birth year is ${new Date().getFullYear() - 100}`)
                .max(new Date().getFullYear() - 17, `Minimum birth year is ${(new Date().getFullYear() - 18)}`)
                .required(),
            email: yup
                .string()
                .email('Invalid email format')
                .max(100, 'Email must be at most 100 characters')
                .matches(/^[a-zA-Z0-9._%+-]+@smhstaff\.com$/, 'Email must be from @smhstaff.com').required()
                .required('Email is required'),
            phoneNumber: yup
                .string()
                .max(20, 'Phone number must be at most 20 characters')
                .matches(/^(?:\+\d{1,3})?\d{8,10}$/, 'Phone number must be 8-10 digits with valid country code if international')
                .required('Phone number is required'),
            homeAddress: yup.
                string()
                .max(100, 'Home address must be at most 100 characters')
                .required('Home address is required'),
            role: yup
                .string()
                .required('Role is required'),
            department: yup
                .string()
                .required('Department is required'),
            joinDate: yup
                .date()
                .min('01/01/2002', `Maximum join year is 2002`)
                .max(new Date().getFullYear()+1, `Minimum join year is ${new Date().getFullYear()}`)
                .required()
        }),
        onSubmit: (data) => {
            http.put(`/staff/${id}`, data).then((res) => {
                console.log(res.data);
                setEdit(false);
                loadProfileForm();
            }).catch((error) => {
                console.error("Error submitting form:", error);
            });
        }
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            currentPassword: yup
                .string()
                .trim()
                .required("Old password is required"),
            newPassword: yup
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters")
                .max(100, "Password must be at most 100 characters")
                .required("New password is required")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,100}$/,
                    "Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces"
                ),
            confirmPassword: yup
                .string()
                .trim()
                .required("Confirm password is required")
                .oneOf([yup.ref("newPassword")], "Passwords must match")
        }), 
        onSubmit: (data) => {
            http.put(`/staff/password/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    setChangePassword(false);
                    toast.success("Password changed successfully!");
                }).catch(function (err) {
                    toast.error(`${err.response.data.message || err.response.data.errors}`);
                });
        }
    });

    const cancelProfileEdit = () => {
        profileFormik.resetForm();
        setEdit(false);
    };

    const cancelChangePassword = () => {
        passwordFormik.resetForm();
        setChangePassword(false);
    };

    const renderStaffProfile = () => {
        return (
            <>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Staff Profile
                </Typography>
                { !edit && !loading && (
                    <Box component="form" onSubmit={profileFormik.handleSubmit} sx={{ marginBottom: '5%' }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Name"
                            name="name"
                            value={profileFormik.values.name}
                            InputProps={{
                                readOnly: true,
                                style: { pointerEvents: 'none' },
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Birth Date"
                            name="birthDate"
                            type='date'
                            value={profileFormik.values.birthDate || "dd/mm/yyyy"}
                            InputProps={{
                                readOnly: true,
                                style: { pointerEvents: 'none' },
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Email"
                            name="email"
                            type="email"
                            value={profileFormik.values.email}
                            InputProps={{
                                readOnly: true,
                                style: { pointerEvents: 'none' },
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Phone Number"
                            name="phoneNumber"
                            value={profileFormik.values.phoneNumber}
                            InputProps={{
                                readOnly: true,
                                style: { pointerEvents: 'none' },
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Home Address"
                            name="homeAddress"
                            value={profileFormik.values.homeAddress}
                            InputProps={{
                                readOnly: true,
                                style: { pointerEvents: 'none' },
                            }}
                        />
                        <TextField
                            fullWidth
                            select
                            margin="dense"
                            autoComplete="off"
                            label="Role"
                            name="role"
                            value={profileFormik.values.role}
                            InputProps={{
                                readOnly: true,
                                style: { pointerEvents: 'none' },
                            }}
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
                            value={profileFormik.values.department}
                            InputProps={{
                                readOnly: true,
                                style: { pointerEvents: 'none' },
                            }}
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
                            value={profileFormik.values.joinDate || "dd/mm/yyyy"}
                            InputProps={{
                                readOnly: true,
                                style: { pointerEvents: 'none' },
                            }}
                        />
                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            color="primary"
                            onClick={() => setEdit(true)}>
                            Edit Profile
                        </Button>
                        <Button
                            sx={{ mt: 2, ml: 2 }}
                            variant="contained"
                            color="primary"
                            onClick={() => setChangePassword(true)}>
                            Change Password
                        </Button>
                    </Box>
                )}
                { edit && !loading && (
                    <Box component="form" onSubmit={profileFormik.handleSubmit} sx={{ marginBottom: '5%' }}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Name"
                            name="name"
                            value={profileFormik.values.name}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.name && Boolean(profileFormik.errors.name)}
                            helperText={profileFormik.touched.name && profileFormik.errors.name}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Birth Date"
                            name="birthDate"
                            type='date'
                            value={profileFormik.values.birthDate || "dd/mm/yyyy"}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.birthDate && Boolean(profileFormik.errors.birthDate)}
                            helperText={profileFormik.touched.birthDate && profileFormik.errors.birthDate}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Email"
                            name="email"
                            type="email"
                            value={profileFormik.values.email}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.email && Boolean(profileFormik.errors.email)}
                            helperText={profileFormik.touched.email && profileFormik.errors.email}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Phone Number"
                            name="phoneNumber"
                            value={profileFormik.values.phoneNumber}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.phoneNumber && Boolean(profileFormik.errors.phoneNumber)}
                            helperText={profileFormik.touched.phoneNumber && profileFormik.errors.phoneNumber}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Home Address"
                            name="homeAddress"
                            value={profileFormik.values.homeAddress}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.homeAddress && Boolean(profileFormik.errors.homeAddress)}
                            helperText={profileFormik.touched.homeAddress && profileFormik.errors.homeAddress}
                        />
                        <TextField
                            fullWidth
                            select
                            margin="dense"
                            autoComplete="off"
                            label="Role"
                            name="role"
                            value={profileFormik.values.role}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.role && Boolean(profileFormik.errors.role)}
                            helperText={profileFormik.touched.role && profileFormik.errors.role}
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
                            value={profileFormik.values.department}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.department && Boolean(profileFormik.errors.department)}
                            helperText={profileFormik.touched.department && profileFormik.errors.department}
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
                            value={profileFormik.values.joinDate || "dd/mm/yyyy"}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.joinDate && Boolean(profileFormik.errors.joinDate)}
                            helperText={profileFormik.touched.joinDate && profileFormik.errors.joinDate}
                        />
                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!profileFormik.isValid || profileFormik.isSubmitting}>
                            Confirm
                        </Button>
                        <Button
                            sx={{ mt: 2, ml: 2 }}
                            variant="contained"
                            color="neutral"
                            onClick={cancelProfileEdit}>
                            Back
                        </Button>
                    </Box>
                )}
            </>
        );
    };

    const renderChangePassword = () => {
        return (
            <><Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Change Password
                </Typography>
                {
                    !loading && (
                        <><Box component="form" sx={{ maxWidth: "500px" }} onSubmit={passwordFormik.handleSubmit}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Current Password"
                                name="currentPassword" type="password"
                                value={passwordFormik.values.currentPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                                helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword} />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="New Password"
                                name="newPassword" type="password"
                                value={passwordFormik.values.newPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                                helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword} />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Confirm Password"
                                name="confirmPassword" type="password"
                                value={passwordFormik.values.confirmPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                                helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword} />
                            <Button 
                                variant="contained" 
                                sx={{ mt: 2 }} 
                                type="submit"
                            >
                                Confirm
                            </Button>
                            <Button
                                sx={{ mt: 2, ml: 2 }}
                                variant="contained"
                                color="neutral"
                                onClick={cancelChangePassword}>
                                Back
                            </Button>
                        </Box></>
                    )
                }
            </Box></>
        )
    }

    return (
        <Box>
            { !changePassword ? renderStaffProfile() : renderChangePassword() }
            <ToastContainer />
        </Box>
    );
}

export default StaffProfile