import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik'; 
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify'; import 'react-toastify/dist/ReactToastify.css';

// FIX: Nullable values conflicting with form input values (this page and dashboard update page)
// TODO: Make validationSchema accept empty string values (using regex?)

function UserProfile() {

    const { id } = useParams();

    const [user, setUser] = useState({
        name: "", 
        email: "",
        birthDate: "",
        phoneNumber: "",
        mailingAddress: "",
    });
    
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const loadProfileForm = () => {
        http.get(`/user/${id}`).then((res) => {
            console.log(res.data);
            setUser(res.data);
            setLoading(false);
        });
    }

    useEffect(loadProfileForm, []);

    const profileFormik = useFormik({
        initialValues: user,
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
                .max(new Date().getFullYear() - 12, `Minimum birth year is ${(new Date().getFullYear() - 13)}`)
                .nullable(),
            email: yup.string()
                .email('Invalid email format')
                .max(100, 'Email must be at most 100 characters')
                .required('Email is required'),
            phoneNumber: yup
                .string()
                .max(20, 'Phone number must be at most 20 characters')
                .matches(/^(?:\+\d{1,3})?\d{8,10}$/, 'Phone number must be 8-10 digits with valid country code if international')
                .nullable(),
            mailingAddress: yup.string()
                .max(100, 'Home address must be at most 100 characters')
                .nullable()
        }), 
        onSubmit: (data) => {
            http.put(`/user/${id}`, data).then((res) => {
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
            http.put(`/user/password/${id}`, data)
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

    const renderUserProfile = () => {
        return (
            <>
                <Typography variant="h5" sx={{ my: 2 }}>
                    User Profile
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
                            label="Mailing Address"
                            name="mailingAddress"
                            value={profileFormik.values.mailingAddress}
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
                            label="Mailing Address"
                            name="mailingAddress"
                            value={profileFormik.values.mailingAddress}
                            onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur}
                            error={profileFormik.touched.mailingAddress && Boolean(profileFormik.errors.mailingAddress)}
                            helperText={profileFormik.touched.mailingAddress && profileFormik.errors.mailingAddress}
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
            { !changePassword ? renderUserProfile() : renderChangePassword() }
            <ToastContainer />
        </Box>
    );
}

export default UserProfile