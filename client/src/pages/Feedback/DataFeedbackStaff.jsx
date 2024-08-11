import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

import http from '../../http';


function DataFeedbackStaff() {
  const [datafeedbackList, setDataFeedbackList] = useState([]);
  const [search, setSearch] = useState('');
  const onSearchChange = (e) => { setSearch(e.target.value); };

  const getDataFeedback = () => {
    http.get('/datafeedback').then((res) => {
      setDataFeedbackList(res.data);
    });
  };
  const searchDataFeedback = () => {
    http.get(`/datafeedback?search=${search}`).then((res) => { setDataFeedbackList(res.data); });
  };
  useEffect(() => { getDataFeedback(); }, []);

  const onSearchKeyDown = (e) => { if (e.key === "Enter") { searchDataFeedback(); } };

  const onClickSearch = () => {
    searchDataFeedback();
  }
  const onClickClear = () => {
    setSearch('');
    getDataFeedback();
  };

  useEffect(() => {
    http.get('/datafeedback')
      .then((res) => {
        console.log(res.data);
        setDataFeedbackList(res.data);
      });
  },
    []);

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < rating ? '#ffc107' : '#e4e5e9' }}>★</span>
      );
    }
    return stars;
  };

  return (
    <div style={{ width: '100%' }}>{
      <Box>
            <div>
      <Typography variant="h5" sx={{
        my: 2,
        color: 'black',
        fontWeight: 'bold',
        fontStyle: 'Roboto',
        width: '100%', alignItems: 'center'
      }}> FeedBack </Typography>
      </div>

        <Box sx={{ display: 'flex', alignItems: 'right', mb: 2, padding: 2}}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: "#e7e7e7" }}>
            <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
          </Box>
          <IconButton color="primary" onClick={onClickSearch}>
            <Search />
          </IconButton>
          <IconButton color="primary" onClick={onClickClear}>
            <Clear />
          </IconButton>
        </Box>

        <Grid container spacing={2}> {
          datafeedbackList.map((datafeedback, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={datafeedback.id}>
                <Card>
                  <CardContent sx={{backgroundColor: "#e1ffd2"}}>
                    <div>
                      <Typography variant="h6" sx={{ mb: 1 }}> {datafeedback.name} </Typography>
                    </div>
                    <Box sx={{ display: 'flex' }}>
                      {renderStars(datafeedback.ranking)}
                    </Box>
                    <Typography sx={{
                      whiteSpace: 'pre-wrap',
                      whiteSpace: 'nowrap', // Keep the text on a single line
                      overflow: 'hidden', // Hide overflow
                      textOverflow: 'ellipsis' // Add ellipsis for overflow text
                    }}> {datafeedback.best} </Typography>
                    <Typography sx={{
                      whiteSpace: 'pre-wrap',
                      whiteSpace: 'nowrap', // Keep the text on a single line
                      overflow: 'hidden', // Hide overflow
                      textOverflow: 'ellipsis' // Add ellipsis for overflow text
                    }}> {datafeedback.improvement} </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Link to={`/feedbackdisplay/${datafeedback.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{ backgroundColor: '#e5cc3f' }}>
                          View
                        </Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          }
          )
        }
        </Grid>
      </Box>
    }
    </div>
  )
}

export default DataFeedbackStaff