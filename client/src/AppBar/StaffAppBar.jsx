import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, Avatar, IconButton} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const StaffAppBar = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const handleProfile = () => {
    navigate(`/profile/${user.id}`)
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
            <Link to="/dashboard" className="nav-link">Dashboard</Link> {/* Added Dashboard link */}
            {user && (
                <>
                    <IconButton onClick={() => handleProfile()}>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg"/>
                    </IconButton>
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
