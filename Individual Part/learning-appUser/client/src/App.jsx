import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';

import DataFeedbacks from './pages/DataFeedbacks';

import AddDatafeedback from './pages/AddDatafeedback';
import EditDataFeedback from './pages/EditDataFeedback';
import Faq from './pages/Faq';


function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" className='AppBar'>
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div"> SINGAPORE MANAGEMENT HUB </Typography>
              </Link>
              <Link to="/datafeedback" >
                <Typography> Your Feedback </Typography>
              </Link>
              <Link to="/faq">
                <Typography> FAQ </Typography>
              </Link>

            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} element={<DataFeedbacks />} />
            <Route path={"/datafeedback"} element={<DataFeedbacks />} />
            <Route path={"/adddatafeedback"} element={<AddDatafeedback />} />
            <Route path={"/editdatafeedback/:id"} element={<EditDataFeedback />} />
            <Route path={"/faq"} element={<Faq />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;