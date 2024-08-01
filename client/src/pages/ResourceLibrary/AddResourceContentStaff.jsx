import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText, Tooltip, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';

function AddResourceContent() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [inputData, setInputData] = useState(null);

  const formik = useFormik({
    initialValues: {
      type: '',
      data: ''
    },
    validationSchema: yup.object({
      type: yup.string().oneOf(['text', 'videoLink', 'image', 'video', 'file']).required('Content type is required'),
      data: yup.string().required('Content is required')
    }),
    onSubmit: (data) => {
      http.post(`/resourceContent/${postId}`, data)
        .then((res) => {
          console.log(res.data);
          navigate(`/ResourceContentStaff/${postId}`);
        })
        .catch((error) => {
          console.error('Error adding resource content:', error);
        });
    }
  });

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      let formData = new FormData();
      formData.append('file', file);
      http.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          formik.setFieldValue('data', res.data.filename);
          setInputData(res.data.filename);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
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
                accept={formik.values.type === 'image' ? 'image/*' : formik.values.type === 'video' ? 'video/*' : formik.values.type === 'file' ? '*' : ''}
                onChange={onFileChange}
              />
            </Button>
            {inputData && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                {formik.values.type === 'image' && <img src={`${import.meta.env.VITE_FILE_BASE_URL}${inputData}`} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />}
                {formik.values.type === 'video' && <video src={`${import.meta.env.VITE_FILE_BASE_URL}${inputData}`} controls style={{ maxWidth: '100%', height: 'auto' }} />}
                {formik.values.type === 'file' && <Typography variant="body2">{inputData}</Typography>}
              </Typography>
            )}
          </FormControl>
        )}

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
      <Tooltip title="Go Back" style={{ textDecoration: 'none', position: 'fixed', bottom: 16, right: 16 }}>
        <Fab color="primary" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}

export default AddResourceContent;
