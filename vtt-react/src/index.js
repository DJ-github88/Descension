// Import polyfills first
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/currency-notification.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Conditionally use StrictMode - disable in production to avoid potential drag/drop issues
const AppWrapper = process.env.NODE_ENV === 'production' ?
  ({ children }) => children :
  React.StrictMode;

root.render(
  <AppWrapper>
    <App />
  </AppWrapper>
);
