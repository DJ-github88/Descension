// Import polyfills first
import './polyfills';

// Global safety mechanism to prevent "title is not defined" ReferenceError
// This is a nuclear option to catch the persistent error that's been plaguing the app
if (typeof window !== 'undefined') {
    // Ensure title is always defined globally as a fallback
    if (typeof window.title === 'undefined') {
        window.title = '';
    }

    // Override any potential undefined title references
    Object.defineProperty(window, 'title', {
        get: function() {
            return document.title || '';
        },
        set: function(value) {
            document.title = value || '';
        },
        configurable: true,
        enumerable: true
    });
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/currency-notification.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Temporarily disable StrictMode to prevent socket recreation issues in multiplayer
const AppWrapper = ({ children }) => children;

root.render(
  <AppWrapper>
    <App />
  </AppWrapper>
);

// Register service worker for caching and performance
serviceWorkerRegistration.register();
