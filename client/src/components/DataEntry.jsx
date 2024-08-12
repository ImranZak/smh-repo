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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const result = await axios.get('http://localhost:3001/api/usage');
      console.log('Fetched entries:', result.data);
      setEntries(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (!dateString.match(regex)) return false;

    const date = new Date(dateString);
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;
    return dateString === date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidDate(date)) {
      setError('Please enter a valid date.');
      return;
    }

    try {
      const usageData = {
        date,
        type,
        amount: parseFloat(usage),  // Use "amount" instead of "usage" to match your model
      };

      await axios.post('http://localhost:3001/api/usage', usageData);
      fetchEntries();
      setDate('');
      setType('energy');
      setUsage('');
      setError('');
    } catch (error) {
      console.error('Error submitting data:', error.response || error);
      setError('Failed to submit data. Please try again.');
    }
  };

  const handleClearData = async () => {
    try {
      await axios.delete('http://localhost:3001/api/usage');
      fetchEntries();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handleUpdateData = async (id, field, value) => {
    try {
      const updatedData = { [field]: field === 'amount' ? parseFloat(value) : value };
      await axios.put(`http://localhost:3001/api/usage/${id}`, updatedData);
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
        return (order === 'asc' ? a.amount - b.amount : b.amount - a.amount);
      }
    });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Enter Usage Data</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
              label="Usage"
              type="number"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="success">Submit</Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={3} alignItems="center" style={{ marginTop: '20px' }}>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleClearData}>Clear Data</Button>
        </Grid>
        <Grid item>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            displayEmpty
            style={{ marginLeft: '10px' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="energy">Energy</MenuItem>
            <MenuItem value="water">Water</MenuItem>
          </Select>
        </Grid>
      </Grid>
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
              <TableCell sortDirection={orderBy === 'amount' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEntries.map((entry) => {
              const dateValue = new Date(entry.date);
              const dateString = !isNaN(dateValue.getTime()) ? dateValue.toISOString().substring(0, 10) : '';
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <TextField
                      type="date"
                      value={dateString}
                      onChange={(e) => handleUpdateData(entry.id, 'date', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={entry.type}
                      onChange={(e) => handleUpdateData(entry.id, 'type', e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="energy">Energy</MenuItem>
                      <MenuItem value="water">Water</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={entry.amount}
                      onChange={(e) => handleUpdateData(entry.id, 'amount', e.target.value)}
                      type="number"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DataEntry;
