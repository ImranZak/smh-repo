// StaffAppBar.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const StaffAppBar = () => {

  return (
    <AppBar position="static" className='AppBar' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container>
        <Toolbar disableGutters className='Toolbar'>
          <Typography variant="h6" component="div">
            <Link to="/" className='Logo'>
              Singapore<br />
              Management<br />
              Hub
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/reports" className="nav-link">Reports</Link>
            <Link to="/quizzesStaff" className="nav-link">Quizzes</Link>
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default StaffAppBar;
