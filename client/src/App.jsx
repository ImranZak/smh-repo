import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import DataFeedbackStaff from './pages/DataFeedbackStaff';
import FeedbackDisplay from './pages/FeedbackDisplay';

import DataFeedbacks from './pages/DataFeedbacks';

import AddDatafeedback from './pages/AddDatafeedback';
import EditDataFeedback from './pages/EditDataFeedback';
import Faq from './pages/Faq';

function App() {
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
          <Toolbar disableGutters={true}>
            <Link to="/">
              <Typography variant="h6" component="div"> SINGAPORE MANAGEMENT HUB </Typography>
            </Link>
            <Link to="/datafeedbackstaff" >
              <Typography> User Feedback </Typography>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>

      <Container>
        <Routes>

          <Route path={"/"} element={<DataFeedbacks />} />
          <Route path={"/datafeedbackstaff"} element={<DataFeedbackStaff />} />
          <Route path={"/feedbackdisplay/:id"} element={<FeedbackDisplay />} />

          <Route path={"/datafeedback"} element={<DataFeedbacks />} />
          <Route path={"/adddatafeedback"} element={<AddDatafeedback />} />
          <Route path={"/editdatafeedback/:id"} element={<EditDataFeedback />} />
          <Route path={"/faq"} element={<Faq />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;


