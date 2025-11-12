import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Configure axios base URL globally
// In development, use proxy (empty baseURL). In production, use environment variable
if (process.env.NODE_ENV === 'development') {
  // Use proxy in development (package.json proxy setting)
  axios.defaults.baseURL = '';
} else {
  // Use environment variable in production
  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || '';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 