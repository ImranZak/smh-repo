import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState({
        name: "",
        description: "",
        status: "",
        type: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/event/${id}`).then((res) => {
            setEvent(res.data);
            setImageFile(res.data.imageFile);
            setLoading(false);
        });
    }, []);


    const formik = useFormik({
        initialValues: event,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Event Name must be at least 3 characters')
                .max(100, 'Event Name must be at most 100 characters')
                .required('Event Name is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            status: yup.string()
                .oneOf(['Completed', 'Upcoming', 'Cancelled'], 'Invalid status')
                .required('Status is required'),
            type: yup.string()
                .oneOf(['In-Person', 'Online', 'TBD'], 'Invalid type')
                .required('Type of event is required'),
            notes: yup.string().trim()
                .max(500, 'Staff Notes must be at most 500 characters'),
            date: yup.date()
                .required('Event Date is required')
                .min(new Date(), 'Event Date cannot be in the past'),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.name = data.name.trim();
            data.description = data.description.trim();
            data.status = data.status.trim();
            data.type = data.type.trim();
            data.notes = data.notes.trim();
            http.put(`/event/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/events");
                });
        }
    });
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteEvent = () => {
        http.delete(`/event/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/staffevents");
            });
    };
    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Event
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={8}></Grid>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Event Name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
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
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                select
                                label="Status"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.status && Boolean(formik.errors.status)}
                                helperText={formik.touched.status && formik.errors.status}
                            >
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Upcoming">Upcoming</MenuItem>
                                <MenuItem value="Cancelled">Ongoing</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                select
                                label="Type"
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.type && Boolean(formik.errors.type)}
                                helperText={formik.touched.type && formik.errors.type}
                            >
                                <MenuItem value="In-Person">In-Person</MenuItem>
                                <MenuItem value="Online">Online</MenuItem>
                                <MenuItem value="TBD">TBD</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                multiline minRows={2}
                                label="Notes"
                                name="notes"
                                value={formik.values.notes}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.notes && Boolean(formik.errors.notes)}
                                helperText={formik.touched.notes && formik.errors.notes}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Event Date"
                                name="date"
                                type="date"
                                value={formik.values.date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.date && Boolean(formik.errors.date)}
                                helperText={formik.touched.date && formik.errors.date}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                fullWidth margin="dense"
                                label="Location"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.location && Boolean(formik.errors.location)}
                                helperText={formik.touched.location && formik.errors.location}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box sx={{ textAlign: 'center', mt: 2 }} >
                                <Button variant="contained" component="label">
                                    Edit Image
                                    <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                                </Button>
                                {
                                    imageFile && (
                                        <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                            <img alt="event"
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                            </img>
                                        </Box>
                                    )
                                }
                            </Box>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Event
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteEvent}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
}
export default EditEvent