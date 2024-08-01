// StaffAppBar.jsx

import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const StaffAppBar = () => {
  const { user } = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

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
            <Link to="/staffevents" className="nav-link">Event List</Link>
            <Link to="/staff" className="nav-link">Staff</Link>
            <Link to="/users" className="nav-link">Users</Link>
            <Link to="/ResourceLibraryStaff" className="nav-link">Resource Library</Link>
            <Link to="/quizzesStaff" className="nav-link">Quizzes</Link>
            {user && (
                <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                </>
            )}
            {!user && (
                <>
                    <Link to="/register">
                        <Typography>Register</Typography>
                    </Link>
                    <Link to="/login">
                        <Typography>Login</Typography>
                    </Link>
                </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default StaffAppBar;
