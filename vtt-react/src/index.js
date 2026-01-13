// Import polyfills first
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/currency-notification.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { isDevelopment } from './config/env';

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
