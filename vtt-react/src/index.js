import './polyfills';

import { initStoreRegistry } from './store/initStoreRegistry';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/currency-notification.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { isDevelopment } from './config/env';
import ErrorBoundary from './components/common/ErrorBoundary';

initStoreRegistry();

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

// Disable default browser context menu across the entire app so only custom in-app menus appear
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}, false);

// Suppress native browser tooltips so unstyled "no CSS" default boxes never clash with custom tooltips
window.addEventListener('mouseover', (e) => {
    let el = e.target;
    while (el && el !== document.body) {
        if (el.hasAttribute && el.hasAttribute('title')) {
            const titleVal = el.getAttribute('title');
            if (titleVal) {
                el.setAttribute('data-original-title', titleVal);
                if (!el.hasAttribute('aria-label')) {
                    el.setAttribute('aria-label', titleVal);
                }
                el.removeAttribute('title');
            }
        }
        el = el.parentElement;
    }
}, true);

window.addEventListener('mouseout', (e) => {
    let el = e.target;
    while (el && el !== document.body) {
        if (el.hasAttribute && el.hasAttribute('data-original-title')) {
            el.setAttribute('title', el.getAttribute('data-original-title'));
            el.removeAttribute('data-original-title');
        }
        el = el.parentElement;
    }
}, true);

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

// Ensure service workers and caches are unregistered in all environments
// to guarantee that users always receive the latest deployed build.
serviceWorkerRegistration.unregister();
