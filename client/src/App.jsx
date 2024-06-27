import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import StaffTheme from './themes/StaffTheme';
import Staff from './pages/Staff';
import CreateStaff from './pages/CreateStaff';
import UpdateStaff from './pages/UpdateStaff';

function App() {
  return (
    <Router>
      <ThemeProvider theme={StaffTheme}>
        <AppBar position="static" className="AppBar">
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  SMH
                </Typography>
              </Link>
              <Link to="/staff" ><Typography>Staff</Typography></Link>
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} element={<Staff />} />
            <Route path={"/staff"} element={<Staff />} />
            <Route path={"/create-staff"} element={<CreateStaff />} />
            <Route path={"/update-staff/:id"} element={<UpdateStaff />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;
