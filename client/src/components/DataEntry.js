import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Grid, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Select, MenuItem
} from '@mui/material';

const DataEntry = () => {
  const [date, setDate] = useState('');
  const [type, setType] = useState('energy');
  const [usage, setUsage] = useState('');
  const [entries, setEntries] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const result = await axios.get('http://localhost:3000/api/usage');  // Ensure this matches your backend endpoint
      setEntries(result.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/usage', { date, type, usage });  // Ensure this matches your backend endpoint
      fetchEntries();
      setDate('');
      setType('energy');
      setUsage('');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleClearData = async () => {
    try {
      await axios.delete('http://localhost:3000/api/usage');  // Ensure this matches your backend endpoint
      fetchEntries();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handleUpdateData = async (id, date, type, usage) => {
    try {
      await axios.put(`http://localhost:3000/api/usage/${id}`, { date, type, usage });  // Ensure this matches your backend endpoint
      fetchEntries();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedEntries = [...entries]
    .filter(entry => !filterType || entry.type === filterType)
    .sort((a, b) => {
      if (orderBy === 'date') {
        return (order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
      } else if (orderBy === 'type') {
        return (order === 'asc' ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type));
      } else {
        return (order === 'asc' ? a.usage - b.usage : b.usage - a.usage);
      }
    });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Enter Usage Data</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Type"
              select
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="energy">Energy</MenuItem>
              <MenuItem value="water">Water</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Usage"
              type="number"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </Grid>
        </Grid>
      </form>
      <Button variant="contained" color="secondary" onClick={handleClearData} style={{ marginTop: '20px' }}>Clear Data</Button>
      <Select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        displayEmpty
        style={{ marginTop: '20px' }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="energy">Energy</MenuItem>
        <MenuItem value="water">Water</MenuItem>
      </Select>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === 'date' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'type' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'type'}
                  direction={orderBy === 'type' ? order : 'asc'}
                  onClick={() => handleSort('type')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'usage' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'usage'}
                  direction={orderBy === 'usage' ? order : 'asc'}
                  onClick={() => handleSort('usage')}
                >
                  Usage
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <TextField
                    type="date"
                    value={entry.date.split('T')[0]}
                    onChange={(e) => handleUpdateData(entry.id, e.target.value, entry.type, entry.usage)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    value={entry.type}
                    onChange={(e) => handleUpdateData(entry.id, entry.date, e.target.value, entry.usage)}
                    fullWidth
                  >
                    <MenuItem value="energy">Energy</MenuItem>
                    <MenuItem value="water">Water</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={entry.usage}
                    onChange={(e) => handleUpdateData(entry.id, entry.date, entry.type, e.target.value)}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DataEntry;
