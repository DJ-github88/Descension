/**
 * Input Sanitization Service
 * Prevents XSS attacks by sanitizing user input
 */

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const logger = require('./logger');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize a string to prevent XSS
 * @param {string} input - Input string to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} - Sanitized string
 */
function sanitizeString(input, options = {}) {
  if (typeof input !== 'string') {
    return input;
  }

  const defaultOptions = {
    ALLOWED_TAGS: [], // No HTML tags allowed by default
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  };

  return DOMPurify.sanitize(input, { ...defaultOptions, ...options });
}

/**
 * Sanitize an object recursively
 * @param {Object} obj - Object to sanitize
 * @param {Array} allowedFields - Fields that should be sanitized (default: all string fields)
 * @param {Array} skipFields - Fields that should not be sanitized
 * @returns {Object} - Sanitized object
 */
function sanitizeObject(obj, allowedFields = null, skipFields = []) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, allowedFields, skipFields));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip fields that should not be sanitized (e.g., passwords, tokens)
    if (skipFields.includes(key)) {
      sanitized[key] = value;
      continue;
    }

    if (allowedFields && !allowedFields.includes(key)) {
      sanitized[key] = value;
      continue;
    }

    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, allowedFields, skipFields);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize user input for chat messages
 * @param {string} message - Chat message
 * @returns {string} - Sanitized message
 */
function sanitizeChatMessage(message) {
  if (typeof message !== 'string') {
    return '';
  }
  // Allow basic formatting but strip dangerous content
  return DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitize room name
 * @param {string} roomName - Room name
 * @returns {string} - Sanitized room name
 */
function sanitizeRoomName(roomName) {
  if (typeof roomName !== 'string') {
    return '';
  }
  // No HTML allowed in room names
  return sanitizeString(roomName).substring(0, 50); // Max 50 chars
}

/**
 * Sanitize player name
 * @param {string} playerName - Player name
 * @returns {string} - Sanitized player name
 */
function sanitizePlayerName(playerName) {
  if (typeof playerName !== 'string') {
    return '';
  }
  // No HTML allowed in player names
  return sanitizeString(playerName).substring(0, 50); // Max 50 chars
}

/**
 * Create Socket.IO middleware for automatic input sanitization
 * @param {Object} options - Configuration options
 * @returns {Function} - Socket middleware function
 */
function createSanitizationMiddleware(options = {}) {
  const {
    logSanitization = false,
    fieldsToSanitize = null, // null = sanitize all string fields
    fieldsToSkip = ['password', 'passwordHash', 'token'] // Fields that should not be sanitized
  } = options;

  return (socket, next) => {
    // Override socket.on to add sanitization
    const originalOn = socket.on.bind(socket);

    socket.on = function(event, handler) {
      const sanitizedHandler = async(data) => {
        // Skip sanitization for internal events
        const internalEvents = ['connect', 'disconnect', 'error', 'ping', 'pong'];
        if (internalEvents.includes(event)) {
          return handler(data);
        }

        // Sanitize the data
        let sanitizedData = data;
        if (data && typeof data === 'object') {
          sanitizedData = sanitizeObject(data, fieldsToSanitize, fieldsToSkip);
          
          if (logSanitization && JSON.stringify(data) !== JSON.stringify(sanitizedData)) {
            logger.debug('Data sanitized', { 
              socketId: socket.id, 
              event, 
              originalSize: JSON.stringify(data).length,
              sanitizedSize: JSON.stringify(sanitizedData).length
            });
          }
        } else if (typeof data === 'string') {
          sanitizedData = sanitizeString(data);
        }

        // Process the event with sanitized data
        try {
          await handler(sanitizedData);
        } catch (error) {
          console.error(`Error in sanitized handler for event '${event}':`, error);
        }
      };

      return originalOn(event, sanitizedHandler);
    };

    next();
  };
}


module.exports = {
  sanitizeString,
  sanitizeObject,
  sanitizeChatMessage,
  sanitizeRoomName,
  sanitizePlayerName,
  createSanitizationMiddleware
};

