import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import StaffEvents from './pages/StaffEvents';
import SignUp from './pages/SignUp';

function App() {
  return (
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    Event Creation
                  </Typography>
                </Link>
                <Link to="/events" ><Typography>Events</Typography></Link>
                <Link to="/staffevents" ><Typography> Staff Events</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
              </Toolbar>
            </Container>
          </AppBar>
          <Container>
            <Routes>
              <Route path={"/"} element={<Events />} />
              <Route path={"/events"} element={<Events />} />
              <Route path={"/addevent"} element={<AddEvent />} />
              <Route path={"/editevent/:id"} element={<EditEvent />} />
              <Route path={"/staffevents"} element={<StaffEvents />} />
              <Route path={"/sign-up/:id"} element={<SignUp />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
  );
}
export default App;