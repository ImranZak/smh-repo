import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik'; 
import * as yup from 'yup';
import http from '../../http';

// FIX: Nullable values conflicting with form input values (this page and dashboard update page)
// TODO: Make validationSchema accept empty string values (using regex?)

function ChangePassword() {

    const { id } = useParams();

    const [user, setUser] = useState({
        name: "", 
        email: "",
        birthDate: "",
        phoneNumber: "",
        mailingAddress: ""
    });

    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const loadForm = () => {
        http.get(`/user/${id}`).then((res) => {
            console.log(res.data);
            setUser(res.data);
            setLoading(false);
        });
    }

    useEffect(loadForm, []);

    const formik = useFormik({
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
            phoneNumber: yup.string()
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
                loadForm();
            }).catch((error) => {
                console.error("Error submitting form:", error);
            });
        }
    });

    const handleCancel = () => {
        formik.resetForm();
        setEdit(false);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Change Password
            </Typography>
        </Box>
    );
}

export default ChangePassword;