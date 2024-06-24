import './App.css';
import Quizzes from './pages/Quizzes';
import EditQuiz from './pages/EditQuiz.jsx';
import AddQuiz from './pages/AddQuiz';
import Questions from './pages/Questions.jsx'
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';
function App() {
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
          <Toolbar disableGutters={true}>
            <Link to="/">
              <Typography variant="h6" component="div">
                Sustainable
                Management 
                Hub
              </Typography>
            </Link>
            <Link to="/quizzes" ><Typography>Quizzes</Typography></Link>
            <Link to="/questions/:quizId"><Typography>Questions</Typography></Link>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/"} element={<Quizzes />} />
          <Route path={"/quizzes"} element={<Quizzes />} />
          <Route path={"/editquiz/:id"} element={<EditQuiz />} />
          <Route path={"/addquiz"} element={<AddQuiz />} />
          <Route path={"/questions/:quizId"} element={<Questions />} />
        </Routes>
      </Container>
    </Router>
  );
}
export default App;