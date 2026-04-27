import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/currency-notification.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { isDevelopment } from './config/env';

if (!isDevelopment()) {
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.info = noop;
  console.debug = noop;
  const originalError = console.error;
  console.error = (...args) => {
    const msg = args.join(' ');
    if (typeof msg === 'string' && (
      msg.includes('act(') ||
      msg.includes('Warning:') ||
      msg.includes('ReactDOM.render') ||
      msg.includes('Unsupported style property')
    )) return;
    originalError.apply(console, args);
  };
}

// Note: Global title polyfills and other environment setups are handled in ./polyfills

import ErrorBoundary from './components/common/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Temporarily disable StrictMode to prevent socket recreation issues in multiplayer
const AppWrapper = ({ children }) => children;

root.render(
    <ErrorBoundary>
        <AppWrapper>
            <App />
        </AppWrapper>
    </ErrorBoundary>
);

// Handle service worker registration
if (isDevelopment()) {
    // Explicitly unregister in development to ensure HMR works correctly
    // and developers see changes immediately without a hard reset.
    serviceWorkerRegistration.unregister();
} else {
    // Register service worker for caching and performance in production
    serviceWorkerRegistration.register();
}
