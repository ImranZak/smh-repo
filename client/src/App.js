import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CommunityDashboard from './pages/CommunityDashboard';
import './App.css';
import logo from './logo.svg'; // Ensure this import is correct

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/dashboard" element={<CommunityDashboard />} />
                    <Route path="/" element={
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <p>
                                Edit <code>src/App.js</code> and save to reload.
                            </p>
                            <a
                                className="App-link"
                                href="https://reactjs.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn React
                            </a>
                        </header>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
