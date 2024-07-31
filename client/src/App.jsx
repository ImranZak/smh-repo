import './App.css';
import Quizzes from './pages/QuizzesStaff.jsx';
import EditQuiz from './pages/EditQuizStaff.jsx';
import AddQuiz from './pages/AddQuizStaff.jsx';
import Questions from './pages/QuestionStaff.jsx';
import AddQuestion from './pages/AddQuestion.jsx';
import EditQuestion from './pages/EditQuestionStaff.jsx';
import QuizzesUser from './pages/QuizUser.jsx';
import TakeQuizUser from './pages/TakeQuizUser.jsx';
import ResourceLibraryStaff from './pages/ResourceLibrary/ResourceLibraryStaff.jsx';
import AddResource from './pages/ResourceLibrary/AddResourceStaff.jsx';
import EditResource from './pages/ResourceLibrary/EditResourceStaff.jsx';
import ResourceContentStaff from './pages/ResourceLibrary/ResourceContentStaff.jsx';
import AddResourceContentStaff from './pages/ResourceLibrary/AddResourceContentStaff.jsx';
import EditResourceContentStaff from './pages/ResourceLibrary/EditResourceContentStaff.jsx';
import ResourceLibraryUser from './pages/ResourceLibrary/ResourceLibraryUser.jsx';
import ResourceContentUserView from './pages/ResourceLibrary/ResourceContentUserView.jsx';
import { Container, AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react'; // Import useState hook for state management
import { ThemeProvider } from '@mui/material/styles';
import theme from './MyTheme/theme.jsx'; // Import your custom theme
import UserAppBar from './AppBar/UserAppBar.jsx';
import StaffAppBar from './AppBar/StaffAppBar';


function App() {
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor element

  const navbar_ver = 'user';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };
  return (
    <ThemeProvider theme={theme}>
      <Router>
      {navbar_ver === 'user' ? <UserAppBar /> : <StaffAppBar />}
        <Container>
          <Routes>
            <Route path="/" element={<Quizzes />} />
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
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
