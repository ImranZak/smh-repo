// UserAppBar.jsx

import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UserContext from '../contexts/UserContext';

const UserAppBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [eventsAnchorEl, setEventsAnchorEl] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate(`/profile/${user.id}`)
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setEventsAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const handleEventsClick = (event) => {  
    setEventsAnchorEl(event.currentTarget);
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
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Button
              className="nav-link"
              aria-controls="events-menu"
              aria-haspopup="true"
              onClick={handleEventsClick}
              style={{ color: '#fff' }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Events
            </Button>
            <Menu
              id="events-menu"
              anchorEl={eventsAnchorEl}
              open={Boolean(eventsAnchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleClose}>
                <Link to="/events" className="dropdown-link">View Events</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/event_history" className="dropdown-link">My Events</Link>
              </MenuItem>
            </Menu>
            <Link to="/book-facilities" className="nav-link">Book Facilities</Link>
            <Link to="/feedback" className="nav-link">Feedback</Link>
            <Button
              className="nav-link"
              aria-controls="menu"
              aria-haspopup="true"
              onClick={handleClick}
              style={{ color: '#fff' }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              EnviroLearn Community
            </Button>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              getcontentanchorel={null}
            >
              <MenuItem onClick={handleClose}>
                <Link to="/quizzesUser" className="dropdown-link">Quizzes</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/quizzesUser/history" className="dropdown-link">Quiz History</Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/ResourceLibraryUser" className="dropdown-link">Educational Materials</Link>
              </MenuItem>
            </Menu>
            <IconButton onClick={() => handleProfile()}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg"/>
            </IconButton>
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

export default UserAppBar;
