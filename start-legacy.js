/**
 * Cross-platform script to start the React development server with legacy OpenSSL provider
 */

// Set the NODE_OPTIONS environment variable
process.env.NODE_OPTIONS = '--openssl-legacy-provider';

// Import and run the start script
require('react-scripts/scripts/start');
