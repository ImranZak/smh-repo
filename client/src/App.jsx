import './App.css';
import Quizzes from './pages/Quizzes';
import EditQuiz from './pages/EditQuiz.jsx';
import AddQuiz from './pages/AddQuiz';
import Questions from './pages/Questions.jsx';
import AddQuestion from './pages/AddQuestion.jsx';
import EditQuestion from './pages/EditQuestion.jsx';
import { Container, AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react'; // Import useState hook for state management
import { ThemeProvider } from '@mui/material/styles';
import theme from './MyTheme/theme.jsx'; // Import your custom theme

function App() {
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };
  return (
    <ThemeProvider theme={theme}>
      <Router>
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
                <Link to="/events" className="nav-link">Events</Link>
                <Link to="/book-facilities" className="nav-link">Book Facilities</Link>
                <Link to="/incident-reporting" className="nav-link">Incident Reporting</Link>
                <Button
                  className="nav-link"
                  aria-controls="menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  style={{ color: '#fff' }}  // Ensure button text color is white
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
                  getContentAnchorEl={null}
                >
                  <MenuItem onClick={handleClose}>
                    <Link to="/quizzes" className="dropdown-link">Quizzes</Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link to="/educational-materials" className="dropdown-link">Educational Materials</Link>
                  </MenuItem>
                </Menu>

                {/* Profile link */}
                <Link to="/profile" className="nav-link profile-link">
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </Link>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/" element={<Quizzes />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/editquiz/:id" element={<EditQuiz />} />
            <Route path="/addquiz" element={<AddQuiz />} />
            <Route path="/quizzes/:quizId/questions" element={<Questions />} />
            <Route path="/quizzes/:quizId/addquestion" element={<AddQuestion />} />
            <Route path="/quizzes/:quizId/editquestion/:questionId" element={<EditQuestion />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
