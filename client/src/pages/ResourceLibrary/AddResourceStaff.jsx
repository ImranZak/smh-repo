import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Fab, Tooltip, MenuItem, FormControl, InputLabel, Select, FormHelperText, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';

function AddResource() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            tag: "",
            status: "Active", // Default value for status
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(255, 'Title must be at most 255 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            tag: yup.string().oneOf(
                ['waste reduction', 'energy conservation', 'water management', 'green living tips'],
                'Invalid tag selection'
            ).required('Tag is required'),
            status: yup.string().oneOf(["Active", "Inactive"]).required('Status is required'),
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.post("/resource", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/ResourceLibraryStaff");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Resource
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense"
                    label="Title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                    fullWidth margin="dense"
                    multiline
                    minRows={2}
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
                <FormControl fullWidth margin="dense" error={formik.touched.tag && Boolean(formik.errors.tag)}>
                    <InputLabel id="tag-select-label">Tag</InputLabel>
                    <Select
                        labelId="tag-select-label"
                        id="tag-select"
                        name="tag"
                        value={formik.values.tag}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Tag"
                    >
                        <MenuItem value="waste reduction">Waste Reduction</MenuItem>
                        <MenuItem value="energy conservation">Energy Conservation</MenuItem>
                        <MenuItem value="water management">Water Management</MenuItem>
                        <MenuItem value="green living tips">Green Living Tips</MenuItem>
                    </Select>
                    <FormHelperText>{formik.touched.tag && formik.errors.tag}</FormHelperText>
                </FormControl>
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
                <Link to="/ResourceLibraryStaff" style={{ textDecoration: 'none', position: 'fixed', bottom: 16, right: 16 }}>
                    <Fab color="primary" aria-label="back">
                        <ArrowBackIcon />
                    </Fab>
                </Link>
            </Tooltip>
        </Box>
    );
}

export default AddResource;
