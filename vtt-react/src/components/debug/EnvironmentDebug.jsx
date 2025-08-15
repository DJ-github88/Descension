import React from 'react';

const EnvironmentDebug = () => {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_SOCKET_URL: process.env.REACT_APP_SOCKET_URL,
    hostname: window.location.hostname,
    origin: window.location.origin,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };

  const socketUrl = process.env.REACT_APP_SOCKET_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://descension-production.up.railway.app'
      : 'http://localhost:3001');

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 10000,
      maxWidth: '300px'
    }}>
      <h4>🔧 Environment Debug</h4>
      <div><strong>Environment:</strong> {envInfo.NODE_ENV}</div>
      <div><strong>Socket URL:</strong> {socketUrl}</div>
      <div><strong>Hostname:</strong> {envInfo.hostname}</div>
      <div><strong>Origin:</strong> {envInfo.origin}</div>
      <div><strong>Time:</strong> {envInfo.timestamp}</div>
      
      <details style={{ marginTop: '10px' }}>
        <summary>Full Environment</summary>
        <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(envInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default EnvironmentDebug;
