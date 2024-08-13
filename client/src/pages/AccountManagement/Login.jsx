import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../contexts/UserContext';

function Login() {
    const navigate = useNavigate();
    const { setUser, setIsStaff } = useContext(UserContext);
    const [changePassword, setChangePassword] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [getEmail, setGetEmail] = useState(false);
    const [email, setEmail] = useState(false);

    const loginFormik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
        }),
        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            if (data.email.match(/^[a-zA-Z0-9._%+-]+@smhstaff\.com$/)) {
                http.post("/staff/login", data)
                .then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setIsStaff(true);
                    setUser(res.data.user);
                    navigate("/staff")
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
            } else {
                http.post("/api/user/login", data || {})
                .then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setUser(res.data.user);
                    navigate("/");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message || err.response.data.errors}`);
                });
            }
        }
    });

    const getEmailFormik = useFormik({
        initialValues: {
            email: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            email: yup.string()
                .email('Invalid email format')
                .max(100, 'Email must be at most 100 characters')
                .required('Email is required'),
        }),
        onSubmit: (data) => {
            const toastId = toast.loading("Sending email...");
            http.post('/api/user/verify', {
                email: data.email
            })
                .then((res) => {
                    console.log(res.data);
                    setVerifyEmail(true);
                    toast.update(toastId, { render: "Email sent!", type: "success", isLoading: false, autoClose: 1000 });
                }).catch(function (err) {
                    toast.update(toastId, { render: `${err.response.data.message || err.response.data.errors}`, type: "error", isLoading: false, autoClose: 5000 });
                });
        }
    });
    
    const verifyEmailFormik = useFormik({
        initialValues: {
            verificationCode: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            verificationCode: yup
                .number()
                .min(111111)
                .max(1000000)
                .required('Verification code is required'),
        }),
        onSubmit: (data) => {
            http.put(`/api/user/verify/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    setVerifyEmail(false);
                    toast.success("Email verified successfully!");
                }).catch(function (err) {
                    toast.error(`${err.response.data.message || err.response.data.errors}`);
                });
        }
    });

    const passwordFormik = useFormik({
        initialValues: {
            newPassword: "",
            confirmNewPassword: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
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
            http.put(`/api/user/password/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    setChangePassword(false);
                    toast.success("Password changed successfully!");
                }).catch(function (err) {
                    toast.error(`${err.response.data.message || err.response.data.errors}`);
                });
        }
    });

    const cancelChangePassword = () => {
        passwordFormik.resetForm();
        setChangePassword(false);
    };

    const cancelVerifyEmail = () => {
        verifyEmailFormik.resetForm();
        setVerifyEmail(false);
    };

    const cancelGetEmail = () => {
        getEmailFormik.resetForm();
        setGetEmail(false);
    };


    const handleVerifyEmail = async () => {
        const toastId = toast.loading("Sending email...");
        http.post('/api/user/verify', {
            email: email
        })
            .then((res) => {
                console.log(res.data);
                setVerifyEmail(true);
                toast.update(toastId, { render: "Email sent!", type: "success", isLoading: false, autoClose: 1000 });
            }).catch(function (err) {
                toast.update(toastId, { render: `${err.response.data.message || err.response.data.errors}`, type: "error", isLoading: false, autoClose: 5000 });
            });
    };

    const renderLogin = () => {
        return (
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Login
                </Typography>
                <Box component="form" sx={{ maxWidth: '500px' }}
                    onSubmit={loginFormik.handleSubmit}>
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Email"
                        name="email"
                        value={loginFormik.values.email}
                        onChange={loginFormik.handleChange}
                        onBlur={loginFormik.handleBlur}
                        error={loginFormik.touched.email && Boolean(loginFormik.errors.email)}
                        helperText={loginFormik.touched.email && loginFormik.errors.email}
                    />
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Password"
                        name="password" type="password"
                        value={loginFormik.values.password}
                        onChange={loginFormik.handleChange}
                        onBlur={loginFormik.handleBlur}
                        error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
                        helperText={loginFormik.touched.password && loginFormik.errors.password}
                    />
                    <Button fullWidth variant="contained" sx={{ mt: 2 }}
                        type="submit">
                        Login
                    </Button>
                    {/* <Button fullWidth variant="text" sx={{ mt: 2, color: 'green' }} 
                    onClick={() => setGetEmail(true)}>
                        Forgot Password
                    </Button> */}
                </Box>
                <ToastContainer />
            </Box>
        );
    }

    const renderGetEmail = () => {
        return (
            <>
                <Box>
                    <Typography variant="h5" sx={{ my: 2 }}>
                        Get Email
                    </Typography>
                    <>
                        <Box
                            component="form"
                            sx={{ maxWidth: "500px" }}
                            onSubmit={getEmailFormik.handleSubmit}
                        >
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Verification Code"
                                name="verificationCode"
                                type="password"
                                value={
                                    getEmailFormik.values.verificationCode
                                }
                                onChange={getEmailFormik.handleChange}
                                onBlur={getEmailFormik.handleBlur}
                                error={
                                    getEmailFormik.touched
                                        .verificationCode &&
                                    Boolean(
                                        getEmailFormik.errors
                                            .verificationCode
                                    )
                                }
                                helperText={
                                    getEmailFormik.touched
                                        .verificationCode &&
                                    getEmailFormik.errors.verificationCode
                                }
                            />
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
                                onClick={cancelGetEmail}
                            >
                                Back
                            </Button>
                        </Box>
                    </>
                </Box>
            </>
        )
    }

    const renderVerifyEmail = () => {
        return (
            <>
                <Box>
                    <Typography variant="h5" sx={{ my: 2 }}>
                        Verify Email
                    </Typography>
                    <>
                        <Box
                            component="form"
                            sx={{ maxWidth: "500px" }}
                            onSubmit={verifyEmailFormik.handleSubmit}
                        >
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Verification Code"
                                name="verificationCode"
                                type="password"
                                value={
                                    verifyEmailFormik.values.verificationCode
                                }
                                onChange={verifyEmailFormik.handleChange}
                                onBlur={verifyEmailFormik.handleBlur}
                                error={
                                    verifyEmailFormik.touched
                                        .verificationCode &&
                                    Boolean(
                                        verifyEmailFormik.errors
                                            .verificationCode
                                    )
                                }
                                helperText={
                                    verifyEmailFormik.touched
                                        .verificationCode &&
                                    verifyEmailFormik.errors.verificationCode
                                }
                            />
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
                                onClick={cancelVerifyEmail}
                            >
                                Back
                            </Button>
                        </Box>
                    </>
                </Box>
            </>
        );
    }

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
            {renderLogin()}
            {/* {!changePassword && !verifyEmail && !getEmail && renderLogin()}
            {getEmail && renderGetEmail()}
            {verifyEmail && renderVerifyEmail()}
            {changePassword && renderChangePassword()}
            <ToastContainer /> */}
        </Box>
    );
}

export default Login;