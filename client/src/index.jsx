import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container); // Create root
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
