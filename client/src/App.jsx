import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import StaffTheme from './themes/StaffTheme';
import Staff from './pages/Staff';
import CreateStaff from './pages/CreateStaff';
import UpdateStaff from './pages/UpdateStaff';
import Register from './pages/Register';
import Login from './pages/Login';
import User from './pages/User';
import http from './http';
import UserContext from './contexts/UserContext';

function App() {
  const [user, setUser] = useState(null); // global user, not specifically user or staff
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
      if (localStorage.getItem("accessToken")) {
        http.get("/user/auth").then((res) => {
            setUser(res.data.user)
            setIsStaff(res.data.user.email.match(/^[a-zA-Z0-9._%+-]+@smhstaff\.com$/));
        });
      }
  }, []);

  const logout = () => {
      localStorage.clear();
      window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, isStaff, setIsStaff }}>
      <Router>
          <ThemeProvider theme={StaffTheme}>
              <AppBar position="static" className="AppBar">
                  <Container>
                      <Toolbar disableGutters={true}>
                        {/* User logo */}
                          { 
                            !isStaff && <Link to="/">
                              <Typography variant="h6" component="div">
                                  SMH
                              </Typography>
                            </Link>
                          }
                          { 
                            isStaff && <Link to="/">
                              <Typography variant="h6" component="div">
                                  SMH Dashboard
                              </Typography>
                            </Link>
                          }
                          { 
                            isStaff && <Link to="/staff">
                                <Typography>Staff</Typography>
                            </Link>
                          }
                          <Box sx={{ flexGrow: 1 }}></Box>
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
                      </Toolbar>
                  </Container>
              </AppBar>

              <Container>
                  <Routes>
                    {/* TODO: Disable staff routes for users */}
                      {/* Universal routes */}
                      <Route path={"/register"} element={<Register />} />
                      <Route path={"/login"} element={<Login />} />
                      {/* User routes */}
                      <Route path={"/"} element={<User/>} />
                      {/* Staff routes */}
                      <Route path={"/staff"} element={<Staff />} />
                      <Route path={"/create-staff"} element={<CreateStaff />} />
                      <Route
                          path={"/update-staff/:id"}
                          element={<UpdateStaff />}
                      />
                  </Routes>
              </Container>
          </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
