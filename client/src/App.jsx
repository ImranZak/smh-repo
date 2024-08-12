import React, { useState, useEffect } from 'react';
import './App.css';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';  
import MyTheme from './MyTheme/theme.jsx';
import Dashboard from './components/Dashboard.jsx';
import DataEntry from './components/DataEntry.jsx';
import Friends from './components/Friends.jsx';
import Messages from './components/Messages.jsx';
import Notifications from './components/Notifications.jsx';
import DataFeedbackStaff from './pages/Feedback/DataFeedbackStaff.jsx';
import FeedbackDisplay from './pages/Feedback/FeedbackDisplay.jsx';
import DataFeedbacks from './pages/Feedback/DataFeedbacks.jsx';
import AddDatafeedback from './pages/Feedback/AddDatafeedback.jsx';
import EditDataFeedback from './pages/Feedback/EditDataFeedback.jsx';
import Faq from './pages/Feedback/Faq.jsx'; 
import Events from './pages/Events/Events.jsx';
import AddEvent from './pages/Events/AddEvent.jsx';
import EditEvent from './pages/Events/EditEvent.jsx';
import Quizzes from './pages/Quiz/QuizzesStaff.jsx';
import EditQuiz from './pages/Quiz/EditQuizStaff.jsx';
import AddQuiz from './pages/Quiz/AddQuizStaff.jsx';
import Questions from './pages/Quiz/QuestionStaff.jsx';
import AddQuestion from './pages/Quiz/AddQuestion.jsx';
import EditQuestion from './pages/Quiz/EditQuestionStaff.jsx';
import QuizzesUser from './pages/Quiz/QuizUser.jsx';
import TakeQuizUser from './pages/Quiz/TakeQuizUser.jsx';
import UserQuizHistory from './pages/Quiz/UserQuizHistory.jsx';
import ResourceLibraryStaff from './pages/ResourceLibrary/ResourceLibraryStaff.jsx';
import AddResource from './pages/ResourceLibrary/AddResourceStaff.jsx';
import EditResource from './pages/ResourceLibrary/EditResourceStaff.jsx';
import ResourceContentStaff from './pages/ResourceLibrary/ResourceContentStaff.jsx';
import AddResourceContentStaff from './pages/ResourceLibrary/AddResourceContentStaff.jsx';
import EditResourceContentStaff from './pages/ResourceLibrary/EditResourceContentStaff.jsx';
import ResourceLibraryUser from './pages/ResourceLibrary/ResourceLibraryUser.jsx';
import ResourceContentUserView from './pages/ResourceLibrary/ResourceContentUserView.jsx';
import UserAppBar from './AppBar/UserAppBar.jsx';
import StaffAppBar from './AppBar/StaffAppBar';
import StaffEvents from './pages/Events/StaffEvents';
import Event_History from './pages/Events/Event_History';
import SignUp from './pages/Events/SignUp';
import SignUps from './pages/Events/SignUps';
import SignUpConfirm from './pages/Events/SignUpConfirm.jsx';
import Staff from './pages/AccountManagement/Staff';
import CreateStaff from './pages/AccountManagement/CreateStaff';
import UpdateStaff from './pages/AccountManagement/UpdateStaff';
import Register from './pages/AccountManagement/Register';
import Login from './pages/AccountManagement/Login';
import Homepage from './pages/Homepage.jsx';
import Users from './pages/AccountManagement/Users.jsx';
import UpdateUser from './pages/AccountManagement/UpdateUser';
import http from './http';
import UserContext from './contexts/UserContext';
import StaffProfile from './pages/AccountManagement/StaffProfile.jsx';
import UserProfile from './pages/AccountManagement/UserProfile.jsx';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      console.error('ErrorBoundary caught an error', error, info);
    }
  
    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
}

function App() {
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element
  const [user, setUser] = useState(null);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user)
        setIsStaff(res.data.user.email.match(/^[a-zA-Z0-9._%+-]+@smhstaff\.com$/));
      });
    }
  }, [user, isStaff]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isStaff, setIsStaff }}>
      <ToastContainer />
      <Router>
        <ThemeProvider theme={MyTheme}>
          {!isStaff ? <UserAppBar /> : <StaffAppBar />}
          <Container>
            <Routes>
              {/* Routes from Incoming branch */}
              <Route path={"/"} element={<Homepage />} />
              <Route path={"/events"} element={<Events />} />
              <Route path={"/addevent"} element={<AddEvent />} />
              <Route path={"/editevent/:id"} element={<EditEvent />} />
              <Route path={"/staffevents"} element={<StaffEvents />} />
              <Route path={"/event_history"} element={<Event_History />} />
              <Route path={"/sign-up/:id"} element={<SignUp />} />
              <Route path={"/signups"} element={<SignUps />} />
              <Route path={"/signupconfirm"} element={<SignUpConfirm />} />
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
              <Route path={"/users"} element={<Users />} />
              <Route path={"/create-staff"} element={<CreateStaff />} />
              <Route path={"/update-staff/:id"} element={<UpdateStaff />} />
              <Route path={"/update-user/:id"} element={<UpdateUser />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/data-entry" element={<DataEntry />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/datafeedbackstaff" element={<DataFeedbackStaff />} />
              <Route path="/feedbackdisplay/:id" element={<FeedbackDisplay />} />
              <Route path="/datafeedback" element={<DataFeedbacks />} />
              <Route path="/adddatafeedback" element={<AddDatafeedback />} />
              <Route path="/editdatafeedback/:id" element={<EditDataFeedback />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/feedback" element={<AddDatafeedback />} />
              <Route path={"/profile/:id"} element={!isStaff ? <UserProfile /> : <StaffProfile />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
