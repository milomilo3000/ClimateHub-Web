import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Configure axios base URL globally
// When using proxy in package.json, we can use relative URLs
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || '';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 