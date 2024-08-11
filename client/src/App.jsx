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
import SignUps from './pages/SignUps';
<<<<<<< Updated upstream
=======
import Staff from './pages/Staff';
import CreateStaff from './pages/CreateStaff';
import UpdateStaff from './pages/UpdateStaff';
import Register from './pages/Register';
import Login from './pages/Login';
import Homepage from './pages/Homepage.jsx';
import Users from './pages/Users.jsx';
import CreateUser from './pages/CreateUser';
import UpdateUser from './pages/UpdateUser';
import Event_History from './pages/Event_History.jsx';

// Imported components from Current branch
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import Friends from './components/Friends';
import Messages from './components/Messages';
import Notifications from './components/Notifications';

// Imported components from Feedback branch
import DataFeedbackStaff from './pages/DataFeedbackStaff';
import FeedbackDisplay from './pages/FeedbackDisplay';
import DataFeedbacks from './pages/DataFeedbacks';
import AddDatafeedback from './pages/AddDatafeedback';
import EditDataFeedback from './pages/EditDataFeedback';
import Faq from './pages/Faq';
>>>>>>> Stashed changes

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
                <Link to="/signups" ><Typography> Sign Up Details</Typography></Link>
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
              <Route path={"/signups"} element={<SignUps />} />
<<<<<<< Updated upstream
=======
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
              <Route path="/quizzesUser/history" element={<UserQuizHistory />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/staff"} element={<Staff />} />
              <Route path={"/event_history"} element={<Event_History />} />
              <Route path={"/users"} element={<Users />} />
              <Route path={"/create-staff"} element={<CreateStaff />} />
              <Route path={"/create-user"} element={<CreateUser />} />
              <Route path={"/update-staff/:id"} element={<UpdateStaff />} />
              <Route path={"/update-user/:id"} element={<UpdateUser />} />

              {/* Routes from Current branch */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/data-entry" element={<DataEntry />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />

              {/* Routes from Feedback branch */}
              <Route path="/datafeedbackstaff" element={<DataFeedbackStaff />} />
              <Route path="/feedbackdisplay/:id" element={<FeedbackDisplay />} />
              <Route path="/datafeedback" element={<DataFeedbacks />} />
              <Route path="/adddatafeedback" element={<AddDatafeedback />} />
              <Route path="/editdatafeedback/:id" element={<EditDataFeedback />} />
              <Route path="/faq" element={<Faq />} />

              {/* Newly Added Route for Feedback */}
              <Route path="/feedback" element={<AddDatafeedback />} />
>>>>>>> Stashed changes
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
  );
}
export default App;