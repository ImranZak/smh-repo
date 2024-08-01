import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Typography } from '@mui/material';
import Navbar from './Navbar'; // Make sure Navbar component is correctly imported

const DataEntry = () => {
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    usage: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/usage', formData);
      alert('Data entered successfully');
      setFormData({ date: '', type: '', usage: '' });
    } catch (error) {
      console.error('Error entering data:', error);
    }
  };

  return (
    <Container>
      <Navbar />
      <Typography variant="h4" gutterBottom>Data Entry</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Usage"
          name="usage"
          type="number"
          value={formData.usage}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">Submit</Button>
      </form>
    </Container>
  );
};

export default DataEntry;
