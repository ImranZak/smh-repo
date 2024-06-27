import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data-entry" element={<DataEntry />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
