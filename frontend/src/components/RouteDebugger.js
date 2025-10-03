import React from 'react';
import { useLocation } from 'react-router-dom';

const RouteDebugger = () => {
  const location = useLocation();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: '#000',
      color: '#fff',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      wordBreak: 'break-all'
    }}>
      <div><strong>Route Debug Info:</strong></div>
      <div>Pathname: {location.pathname}</div>
      <div>Search: {location.search}</div>
      <div>Hash: {location.hash}</div>
      <div>State: {JSON.stringify(location.state)}</div>
      <div>URL: {window.location.href}</div>
      <div>Origin: {window.location.origin}</div>
    </div>
  );
};

export default RouteDebugger;
