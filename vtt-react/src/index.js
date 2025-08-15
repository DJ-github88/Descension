// Import polyfills first
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/currency-notification.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Temporarily disable StrictMode to prevent socket recreation issues in multiplayer
const AppWrapper = ({ children }) => children;

root.render(
  <AppWrapper>
    <App />
  </AppWrapper>
);
