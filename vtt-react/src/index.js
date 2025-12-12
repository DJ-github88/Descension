// Import polyfills first
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/currency-notification.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// ULTIMATE NUCLEAR OPTION: Define title globally in all possible scopes
// This error is persistent and happening in compiled code, so we need to be more aggressive
if (typeof window !== 'undefined') {
    // Define title in global scope
    window.title = document.title || '';

    // Also define it as a global variable
    if (typeof global !== 'undefined') {
        global.title = document.title || '';
    }

    // Define it in the window object with a getter/setter
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

// Also define title as a global variable in case it's being referenced in a closure
var title = typeof document !== 'undefined' ? (document.title || '') : '';
let titleVar = typeof document !== 'undefined' ? (document.title || '') : '';
const titleConst = typeof document !== 'undefined' ? (document.title || '') : '';

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
