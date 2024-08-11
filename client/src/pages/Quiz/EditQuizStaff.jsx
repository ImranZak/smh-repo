import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Fab, Tooltip, MenuItem } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import http from '../../http';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState({
        title: "",
        description: "",
        status: "",
        tag: ""  // Add this line
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/quiz/${id}`).then((res) => {
            setQuiz(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: quiz,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            status: yup.string().oneOf(['Active', 'Inactive'], 'Status must be either Active or Inactive').required('Status is required'),
            tag: yup.string().trim().oneOf(['waste reduction', 'energy conservation', 'water management', 'green living tips']).required('Tag is required')  // Add this line
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.put(`/quiz/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/quizzesStaff");
                });
        }
    });
    const handleEditQuestions = () => {
        navigate(`/quizzesStaff/${id}/questions`);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Quiz
            </Typography>
            {
                !loading && (
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
                        <TextField
                            select
                            fullWidth margin="dense"
                            label="Tag"
                            name="tag"
                            value={formik.values.tag}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.tag && Boolean(formik.errors.tag)}
                            helperText={formik.touched.tag && formik.errors.tag}
                        >
                            <MenuItem value="waste reduction">Waste Reduction</MenuItem>
                            <MenuItem value="energy conservation">Energy Conservation</MenuItem>
                            <MenuItem value="water management">Water Management</MenuItem>
                            <MenuItem value="green living tips">Green Living Tips</MenuItem>
                        </TextField>
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
                            <Button variant="contained" onClick={handleEditQuestions}>
                                Edit Questions
                            </Button>
                            <Button variant="contained" type="submit" sx={{ ml: 3 }}>
                                Update
                            </Button>
                        </Box>
                    </Box>
                )
            }
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

export default EditQuiz;
