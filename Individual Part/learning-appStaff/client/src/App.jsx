import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import DataFeedbacks from './pages/DataFeedbacks';
import FeedbackDisplay from './pages/FeedbackDisplay';

function App() {
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
          <Toolbar disableGutters={true}>
            <Link to="/">
              <Typography variant="h6" component="div"> SINGAPORE MANAGEMENT HUB </Typography>
            </Link>
            <Link to="/datafeedback" >
              <Typography> Your Feedback </Typography>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>

      <Container>
        <Routes>
          <Route path={"/"} element={<DataFeedbacks />} />
          <Route path={"/datafeedback"} element={<DataFeedbacks />} />
          <Route path={"/feedbackdisplay/:id"} element={<FeedbackDisplay />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;