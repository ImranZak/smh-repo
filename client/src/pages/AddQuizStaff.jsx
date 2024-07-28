import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Fab, Tooltip } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddQuiz() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            status: "Active"
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            status: yup.string().required('Status is required')
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.status = data.status.trim();
            http.post("/quiz", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/quizzesStaff");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Quiz
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
                <FormControl>
                    <FormLabel id="status-radio-buttons-group-label">Status</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="status-radio-buttons-group-label"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <FormControlLabel value="Active" control={<Radio />} label="Active" />
                        <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
                    </RadioGroup>
                    {formik.touched.status && formik.errors.status && (
                        <Typography variant="body2" color="error">
                            {formik.errors.status}
                        </Typography>
                    )}
                </FormControl>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
            <Tooltip title="Go Back">
                <Link to={`/quizzesStaff`} style={{ textDecoration: 'none', position: 'fixed', bottom: 16, right: 16 }}>
                    <Fab color="primary" aria-label="add">
                        <ArrowBackIcon />
                    </Fab>
                </Link>
            </Tooltip>
        </Box>
    );
}

export default AddQuiz;