import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#2e7d32' }}>
      <Container>
        <Toolbar>
          <Box display="flex" flexDirection="column" flexGrow={1} alignItems="flex-start">
            <Typography variant="h6" style={{ fontWeight: 'bold', lineHeight: 1 }}>
              {isMobile ? 'SMH' : 'SINGAPORE'}
            </Typography>
            {!isMobile && (
              <Typography variant="h6" style={{ fontWeight: 'bold', lineHeight: 1 }}>
                MANAGEMENT HUB
              </Typography>
            )}
          </Box>
          <Box display={{ xs: 'none', md: 'flex' }} alignItems="center">
            <Button color="inherit" onClick={() => handleNavClick('/dashboard')}>Dashboard</Button>
            <Button color="inherit" onClick={() => handleNavClick('/events')}>Events</Button>
            <Button color="inherit" onClick={() => handleNavClick('/book-facilities')}>Book Facilities</Button>
            <Button color="inherit" onClick={() => handleNavClick('/incident-reporting')}>Incident Reporting</Button>
            <Button color="inherit" onClick={() => handleNavClick('/envirolearn-community')}>EnviroLearn Community</Button>
            <Button color="inherit" onClick={() => handleNavClick('/login')}>Login</Button>
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <List>
          <ListItem button onClick={() => handleNavClick('/dashboard')}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleNavClick('/events')}>
            <ListItemText primary="Events" />
          </ListItem>
          <ListItem button onClick={() => handleNavClick('/book-facilities')}>
            <ListItemText primary="Book Facilities" />
          </ListItem>
          <ListItem button onClick={() => handleNavClick('/incident-reporting')}>
            <ListItemText primary="Incident Reporting" />
          </ListItem>
          <ListItem button onClick={() => handleNavClick('/envirolearn-community')}>
            <ListItemText primary="EnviroLearn Community" />
          </ListItem>
          <ListItem button onClick={() => handleNavClick('/login')}>
            <ListItemText primary="Login" />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
