import './App.css';
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import StaffTheme from './themes/StaffTheme';
=======
import { Container, AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import Quizzes from './pages/Quiz/QuizzesStaff.jsx';
import EditQuiz from './pages/Quiz/EditQuizStaff.jsx';
import AddQuiz from './pages/Quiz/AddQuizStaff.jsx';
import Questions from './pages/Quiz/QuestionStaff.jsx';
import AddQuestion from './pages/Quiz/AddQuestion.jsx';
import EditQuestion from './pages/Quiz/EditQuestionStaff.jsx';
import QuizzesUser from './pages/Quiz/QuizUser.jsx';
import TakeQuizUser from './pages/Quiz/TakeQuizUser.jsx';
import ResourceLibraryStaff from './pages/ResourceLibrary/ResourceLibraryStaff.jsx';
import AddResource from './pages/ResourceLibrary/AddResourceStaff.jsx';
import EditResource from './pages/ResourceLibrary/EditResourceStaff.jsx';
import ResourceContentStaff from './pages/ResourceLibrary/ResourceContentStaff.jsx';
import AddResourceContentStaff from './pages/ResourceLibrary/AddResourceContentStaff.jsx';
import EditResourceContentStaff from './pages/ResourceLibrary/EditResourceContentStaff.jsx';
import ResourceLibraryUser from './pages/ResourceLibrary/ResourceLibraryUser.jsx';
import ResourceContentUserView from './pages/ResourceLibrary/ResourceContentUserView.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react'; // Import useState hook for state management
import UserAppBar from './AppBar/UserAppBar.jsx';
import StaffAppBar from './AppBar/StaffAppBar';
import MyTheme from './MyTheme/theme.jsx';
import StaffEvents from './pages/StaffEvents';
import SignUp from './pages/SignUp';
import SignUps from './pages/SignUps';
>>>>>>> main
import Staff from './pages/Staff';
import CreateStaff from './pages/CreateStaff';
import UpdateStaff from './pages/UpdateStaff';
import Register from './pages/Register';
import Login from './pages/Login';
import User from './pages/User';
import http from './http';
import UserContext from './contexts/UserContext';

function App() {
<<<<<<< HEAD
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
=======
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element
  const [user, setUser] = useState(null);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
          setUser(res.data.user)
          setIsStaff(res.data.user.email.match(/^[a-zA-Z0-9._%+-]+@smhstaff\.com$/));
      });
  }}, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
>>>>>>> main
  };

  return (
    <UserContext.Provider value={{ user, setUser, isStaff, setIsStaff }}>
      <Router>
<<<<<<< HEAD
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
=======
        <ThemeProvider theme={MyTheme}>
          {!isStaff ? <UserAppBar /> : <StaffAppBar />}
          <Container>
            <Routes>
              <Route path={"/"} element={<User />} />
              <Route path={"/events"} element={<Events />} />
              <Route path={"/addevent"} element={<AddEvent />} />
              <Route path={"/editevent/:id"} element={<EditEvent />} />
              <Route path={"/staffevents"} element={<StaffEvents />} />
              <Route path={"/sign-up/:id"} element={<SignUp />} />
              <Route path={"/signups"} element={<SignUps />} />
              <Route path="/quizzesStaff" element={<Quizzes />} />
              <Route path="/editquiz/:id" element={<EditQuiz />} />
              <Route path="/addquiz" element={<AddQuiz />} />
              <Route path="/quizzesStaff/:quizId/questions" element={<Questions />} />
              <Route path="/quizzesStaff/:quizId/addquestion" element={<AddQuestion />} />
              <Route path="/quizzesStaff/:quizId/editquestion/:questionId" element={<EditQuestion />} />
              <Route path="/quizzesUser" element={<QuizzesUser />} />
              <Route path="/takequiz/:id" element={<TakeQuizUser />} />
              <Route path="/ResourceLibraryStaff" element={<ResourceLibraryStaff />} />
              <Route path="/AddResource" element={<AddResource />} />
              <Route path="/EditResource/:id" element={<EditResource />} />
              <Route path="/ResourceContentStaff/:postId" element={<ResourceContentStaff />} />
              <Route path="/ResourceContentStaff/:postId/AddResourceContentStaff" element={<AddResourceContentStaff />} />
              <Route path="/ResourceContentStaff/:postId/EditResourceContentStaff/:id" element={<EditResourceContentStaff />} />
              <Route path="/ResourceLibraryUser" element={<ResourceLibraryUser />} />
              <Route path="/ResourceLibraryUser/ResourceContentUserView/:id" element={<ResourceContentUserView />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/"} element={<User/>} />
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

// function App() {
//   const [user, setUser] = useState(null); // global user, not specifically user or staff
//   const [isStaff, setIsStaff] = useState(false);

//   useEffect(() => {
//       if (localStorage.getItem("accessToken")) {
//         http.get("/user/auth").then((res) => {
//             setUser(res.data.user)
//             setIsStaff(res.data.user.email.match(/^[a-zA-Z0-9._%+-]+@smhstaff\.com$/));
//         });
//       }
//   }, []);

//   const logout = () => {
//       localStorage.clear();
//       window.location = "/";
//   };

//   return (
//       <Router>
//           <ThemeProvider theme={StaffTheme}>
//               <AppBar position="static" className="AppBar">
//                   <Container>
//                       <Toolbar disableGutters={true}>
//                         {/* User logo */}
//                           { 
//                             !isStaff && <Link to="/">
//                               <Typography variant="h6" component="div">
//                                   SMH
//                               </Typography>
//                             </Link>
//                           }
//                           { 
//                             isStaff && <Link to="/">
//                               <Typography variant="h6" component="div">
//                                   SMH Dashboard
//                               </Typography>
//                             </Link>
//                           }
//                           { 
//                             isStaff && <Link to="/staff">
//                                 <Typography>Staff</Typography>
//                             </Link>
//                           }
//                           <Box sx={{ flexGrow: 1 }}></Box>
//                           {user && (
//                               <>
//                                   <Typography>{user.name}</Typography>
//                                   <Button onClick={logout}>Logout</Button>
//                               </>
//                           )}
//                           {!user && (
//                               <>
//                                   <Link to="/register">
//                                       <Typography>Register</Typography>
//                                   </Link>
//                                   <Link to="/login">
//                                       <Typography>Login</Typography>
//                                   </Link>
//                               </>
//                           )}
//                       </Toolbar>
//                   </Container>
//               </AppBar>

//               <Container>
//                   <Routes>
//                   </Routes>
//               </Container>
//           </ThemeProvider>
//       </Router>
//   );
>>>>>>> main
}

export default App;
