import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Snackbar, Alert } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';

import http from '../../http';
//import { AccessTime } from '@mui/icons-material';

import dayjs from 'dayjs';
import global from '../../global';

import './DataFeedbacks.css';

// If you're using inline styles, you can define them like this
const fullPageStyle = {
  margin: 0,
  padding: 0,
  span: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

function DataFeedbacks() {
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
    <div style={{ width: '100%',}}>
      <div className="feedback-header">
      <Typography variant="h5" sx={{
        my: 2,
        color: 'white',
        fontWeight: 'bold',
        fontStyle: 'Roboto',
        width: '100%', alignItems: 'center'
      }}> FeedBack </Typography>
      </div>

      {
        <Box sx={{ alighnItems: 'right', minWidth: '100%', minHeight: '100%', width: '100%', padding:'1%' }}>
          <div className='Search'>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, width: "Fit-content" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: "white" }}>
              <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
            </Box>
            <IconButton color="primary" onClick={onClickSearch}>
              <Search />
            </IconButton>
            <IconButton color="primary" onClick={onClickClear}>
              <Clear />
            </IconButton>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignSelf: "Right"}}>
              <Link to="/adddatafeedback" style={{ textDecoration: 'none'}}>
                <Button variant='contained' style={{backgroundColor: '#208130'}}> Add </Button>
              </Link>
            </Box>
          </Box>
          </div>

          <Grid container spacing={2}> {
            datafeedbackList.map((datafeedback, i) => {
              return (
                <Grid item xs={12} md={6} lg={4} key={datafeedback.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}> {""} </Typography>
                      <Box sx={{ display: 'flex' }}>
                        {renderStars(datafeedback.ranking)} 
                      </Box>
                      <Typography sx={{
                        whiteSpace: 'pre-wrap',
                        whiteSpace: 'nowrap', // Keep the text on a single line
                        overflow: 'hidden', // Hide overflow
                        textOverflow: 'ellipsis' // Add ellipsis for overflow text
                      }}> {"Good: "} {datafeedback.best} </Typography>
                      <Typography sx={{
                        whiteSpace: 'pre-wrap',
                        whiteSpace: 'pre-wrap',
                        whiteSpace: 'nowrap', // Keep the text on a single line
                        overflow: 'hidden', // Hide overflow
                        textOverflow: 'ellipsis' // Add ellipsis for overflow text
                      }}> {"Improvement: "} {datafeedback.improvement} </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography> {dayjs(datafeedback.createdAt).format(global.datetimeFormat)} </Typography>
                      </Box>
                      
                      <div className = 'feedback-buttons'>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignSelf: "Right", backgroundColor:"none"}}>
                          <Link to={`/editdatafeedback/${datafeedback.id}`} style={{ textDecoration: 'none', }}>
                            <Button variant='contained' style={{ textDecoration: 'none', backgroundColor:"#0084ff"}}> Edit </Button>
                          </Link>
                        </Box>
                      </div>
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

export default DataFeedbacks