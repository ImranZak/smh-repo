import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText, Snackbar, Alert, Tooltip, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';

const AddResourceContent = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [file, setFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const validationSchema = yup.object({
    type: yup.string().oneOf(['text', 'image', 'videoLink', 'video', 'file']).required('Content type is required'),
    data: yup.mixed()
  });

  const formik = useFormik({
    initialValues: {
      resourceId: postId,
      type: '',
      data: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('type', values.type);
      formData.append('resourceId', postId); // Add the resourceId
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('data', values.data);
      }

      try {
        const url = `/resourceContent/${postId}`;
        console.log(formData)
        await http.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSnackbarMessage('Resource content added successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        formik.resetForm();
        setFile(null);
      } catch (error) {
        console.error('Error adding resource content:', error); // Improved error logging
        setSnackbarMessage('Failed to add resource content');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    formik.setFieldValue('data', event.target.files[0]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Tooltip title="Go Back">
        <Fab color="primary" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </Fab>
      </Tooltip>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Resource Content
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="type-label">Content Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="videoLink">Video Link</MenuItem>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="file">File</MenuItem>
          </Select>
          <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
        </FormControl>

        {formik.values.type === 'text' && (
          <TextField
            fullWidth
            margin="normal"
            id="data"
            name="data"
            label="Text Content"
            value={formik.values.data}
            onChange={formik.handleChange}
            error={formik.touched.data && Boolean(formik.errors.data)}
            helperText={formik.touched.data && formik.errors.data}
          />
        )}

        {formik.values.type === 'videoLink' && (
          <TextField
            fullWidth
            margin="normal"
            id="data"
            name="data"
            label="Video Link"
            value={formik.values.data}
            onChange={formik.handleChange}
            error={formik.touched.data && Boolean(formik.errors.data)}
            helperText={formik.touched.data && formik.errors.data}
          />
        )}

        {(formik.values.type === 'image' || formik.values.type === 'video' || formik.values.type === 'file') && (
          <FormControl fullWidth margin="normal">
            <Button
              variant="contained"
              component="label"
            >
              Upload {formik.values.type}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {file && <Typography variant="body2">{file.name}</Typography>}
          </FormControl>
        )}

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddResourceContent;