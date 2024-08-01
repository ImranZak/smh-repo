import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText, Tooltip, Fab, CardMedia, Icon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';

function EditResourceContent() {
  const navigate = useNavigate();
  const { postId, id } = useParams();
  const [inputData, setInputData] = useState('');
  const [Resource, setResourceList] = useState({
    resourceId: postId,
    type: '',
    data: null
  });

  const formik = useFormik({
    initialValues: {
      type: '',
      data: ''
    },
    validationSchema: yup.object({
      type: yup.string().oneOf(['text', 'image', 'videoLink', 'video', 'file']).required('Content type is required'),
      data: yup.string().required('Content is required')
    }),
    onSubmit: (values) => {
      const data = {
        type: values.type,
        resourceId: postId,
        data: values.data
      };
      http.put(`/resourceContent/${id}/${postId}`, data)
        .then(() => {
          navigate(`/ResourceContentStaff/${postId}`);
        })
        .catch((error) => {
          console.error('Error updating resource content:', error);
        });
    }
  });

  useEffect(() => {
    http.get(`/resourceContent/one/${id}`)
      .then((res) => {
        const contentData = res.data;
        setResourceList({
          resourceId: contentData.resourceId,
          type: contentData.type,
          data: contentData.data 
        });
        formik.setValues({
            type: contentData.type,
            data: contentData.data 
          });
        setInputData(contentData.data || '');
      })
      .catch((error) => {
        console.error('Error fetching resource content:', error);
      });
  }, [id]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
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

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoFileIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Resource Content
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="type-label">Content Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            name="type"
            value={formik.values.type} // Bind Select value to Formik values
            onChange={formik.handleChange} // Ensure onChange updates Formik values
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
            {inputData && formik.values.type === 'image' && (
              <CardMedia
                component="img"
                image={`${import.meta.env.VITE_FILE_BASE_URL}${inputData}`}
                alt={inputData}
                sx={{ mb: 2, width: '100%', height: 'auto' }}
              />
            )}
            {inputData && formik.values.type === 'video' && (
              <CardMedia
                component="video"
                src={`${import.meta.env.VITE_FILE_BASE_URL}${inputData}`}
                controls
                sx={{ mb: 2, width: '100%', height: 'auto' }}
              />
            )}
            {inputData && formik.values.type === 'file' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getFileIcon(inputData)}
                <Typography variant="body2" sx={{ ml: 1 }}>{inputData}</Typography>
              </Box>
            )}
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

export default EditResourceContent;
