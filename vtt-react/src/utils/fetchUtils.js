import { logger } from './logger';

/**
 * Default timeout for requests (10 seconds)
 */
const DEFAULT_TIMEOUT = 10000;

/**
 * Fetch with timeout and error handling
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} - Fetch promise with timeout
 */
export const fetchWithTimeout = (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchPromise = fetch(url, {
    ...options,
    signal: controller.signal
  });

  return Promise.race([
    fetchPromise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    })
  ]).finally(() => {
    clearTimeout(timeoutId);
  });
};

/**
 * Retry fetch with exponential backoff
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Fetch promise with retries
 */
export const fetchWithRetry = async (url, options = {}, maxRetries = 3, baseDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      logger.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Safe JSON fetch with error handling
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Parsed JSON response
 */
export const fetchJSON = async (url, options = {}) => {
  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('JSON fetch failed:', { url, error: error.message });
    throw error;
  }
};

/**
 * POST JSON data with error handling
 * @param {string} url - Request URL
 * @param {Object} data - Data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - Parsed JSON response
 */
export const postJSON = async (url, data, options = {}) => {
  return fetchJSON(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
};

/**
 * Safe fetch for AI generation with specific error handling
 * @param {string} url - AI service URL
 * @param {Object} data - Generation parameters
 * @param {number} timeout - Custom timeout for AI operations
 * @returns {Promise<Object>} - AI response
 */
export const fetchAIGeneration = async (url, data, timeout = 30000) => {
  try {
    logger.debug('AI Generation request:', { url, data });
    
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }, timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Generation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    logger.debug('AI Generation response received');
    
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('AI generation request was cancelled');
    }
    
    if (error.message.includes('timeout')) {
      throw new Error('AI generation timed out. Please try again.');
    }
    
    logger.error('AI Generation error:', error);
    throw error;
  }
};

/**
 * Health check utility
 * @param {string} url - Service URL to check
 * @param {number} timeout - Timeout for health check
 * @returns {Promise<boolean>} - Service health status
 */
export const healthCheck = async (url, timeout = 5000) => {
  try {
    const response = await fetchWithTimeout(url, { method: 'HEAD' }, timeout);
    return response.ok;
  } catch (error) {
    logger.warn('Health check failed:', { url, error: error.message });
    return false;
  }
};

/**
 * Batch fetch utility for multiple requests
 * @param {Array} requests - Array of request objects { url, options }
 * @param {number} concurrency - Maximum concurrent requests
 * @returns {Promise<Array>} - Array of responses
 */
export const batchFetch = async (requests, concurrency = 5) => {
  const results = [];
  
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    
    const batchPromises = batch.map(async ({ url, options = {} }) => {
      try {
        return await fetchWithTimeout(url, options);
      } catch (error) {
        logger.warn('Batch fetch item failed:', { url, error: error.message });
        return { error: error.message };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
};

export default {
  fetchWithTimeout,
  fetchWithRetry,
  fetchJSON,
  postJSON,
  fetchAIGeneration,
  healthCheck,
  batchFetch
};
