/**
 * Environment variable configuration for the application
 * This file provides a safe way to access environment variables in the browser
 */

// Define environment variables that should be available in the browser
// Use a safe way to access process.env that won't crash in the browser
const getProcessEnv = (key, defaultValue = '') => {
  try {
    // Check if we're in a Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }
    // In browser environment, check window object for injected env vars
    if (typeof window !== 'undefined' && window.process && window.process.env) {
      return window.process.env[key] || defaultValue;
    }
    return defaultValue;
  } catch (error) {
    // Failed to access environment variable
    return defaultValue;
  }
};

const env = {
  // Default environment is development
  NODE_ENV: getProcessEnv('NODE_ENV', 'development'),

  // Public URL for assets
  PUBLIC_URL: getProcessEnv('PUBLIC_URL', ''),

  // API keys and other sensitive information
  // Use empty strings as defaults to prevent undefined errors
  REACT_APP_OPENAI_API_KEY: getProcessEnv('REACT_APP_OPENAI_API_KEY', ''),
};

/**
 * Get an environment variable by key
 * @param {string} key - The environment variable key
 * @param {*} defaultValue - Default value if the environment variable is not set
 * @returns {string} - The environment variable value or default value
 */
export const getEnv = (key, defaultValue = '') => {
  return env[key] !== undefined ? env[key] : defaultValue;
};

/**
 * Check if we're in production environment
 * @returns {boolean} - True if in production environment
 */
export const isProduction = () => {
  return env.NODE_ENV === 'production';
};

/**
 * Check if we're in development environment
 * @returns {boolean} - True if in development environment
 */
export const isDevelopment = () => {
  return env.NODE_ENV === 'development';
};

/**
 * Get the public URL for assets
 * @returns {string} - The public URL
 */
export const getPublicUrl = () => {
  return env.PUBLIC_URL;
};

// Export the environment object for direct access
export default env;
