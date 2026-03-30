/**
 * Validators Module
 * 
 * Contains validation helper functions for server-side validation:
 * - Room validation
 * - Player validation
 * - Data sanitization helpers
 */

const logger = require('../services/logger');

/**
 * Validate room creation data
 * @param {Object} data - Room creation data
 * @returns {Object} { valid, errors }
 */
function validateRoomCreation(data) {
  const errors = [];

  if (!data) {
    errors.push('No data provided');
    return { valid: false, errors };
  }

  if (!data.gmName || typeof data.gmName !== 'string') {
    errors.push('GM name is required');
  } else if (data.gmName.length > 50) {
    errors.push('GM name must be 50 characters or less');
  }

  if (data.roomName && data.roomName.length > 100) {
    errors.push('Room name must be 100 characters or less');
  }

  if (data.password && data.password.length > 100) {
    errors.push('Password must be 100 characters or less');
  }

  if (data.maxPlayers && (data.maxPlayers < 1 || data.maxPlayers > 20)) {
    errors.push('Max players must be between 1 and 20');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate join room data
 * @param {Object} data - Join room data
 * @returns {Object} { valid, errors }
 */
function validateJoinRoom(data) {
  const errors = [];

  if (!data) {
    errors.push('No data provided');
    return { valid: false, errors };
  }

  if (!data.roomId || typeof data.roomId !== 'string') {
    errors.push('Room ID is required');
  }

  if (!data.playerName || typeof data.playerName !== 'string') {
    errors.push('Player name is required');
  } else if (data.playerName.length > 50) {
    errors.push('Player name must be 50 characters or less');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate token creation data
 * @param {Object} data - Token creation data
 * @returns {Object} { valid, errors }
 */
function validateTokenCreation(data) {
  const errors = [];

  if (!data) {
    errors.push('No data provided');
    return { valid: false, errors };
  }

  if (!data.roomId) {
    errors.push('Room ID is required');
  }

  if (!data.token) {
    errors.push('Token data is required');
  } else {
    if (!data.token.position || typeof data.token.position.x !== 'number' || typeof data.token.position.y !== 'number') {
      errors.push('Token position with x and y coordinates is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate chat message
 * @param {Object} data - Chat message data
 * @param {number} maxLength - Maximum message length
 * @returns {Object} { valid, errors }
 */
function validateChatMessage(data, maxLength = 2000) {
  const errors = [];

  if (!data) {
    errors.push('No data provided');
    return { valid: false, errors };
  }

  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required');
  } else if (data.message.length > maxLength) {
    errors.push(`Message must be ${maxLength} characters or less`);
  }

  const validTypes = ['chat', 'system', 'roll', 'party', 'emote', 'whisper'];
  if (data.type && !validTypes.includes(data.type)) {
    errors.push(`Invalid message type. Valid types: ${validTypes.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate character update data
 * @param {Object} data - Character update data
 * @returns {Object} { valid, errors }
 */
function validateCharacterUpdate(data) {
  const errors = [];

  if (!data) {
    errors.push('No data provided');
    return { valid: false, errors };
  }

  if (!data.roomId) {
    errors.push('Room ID is required');
  }

  if (!data.character) {
    errors.push('Character data is required');
  }

  if (data.character) {
    if (data.character.name && data.character.name.length > 50) {
      errors.push('Character name must be 50 characters or less');
    }

    if (data.character.level && (data.character.level < 1 || data.character.level > 100)) {
      errors.push('Level must be between 1 and 100');
    }

    if (data.character.health) {
      if (typeof data.character.health.current !== 'number' || data.character.health.current < 0) {
        errors.push('Health current must be a non-negative number');
      }
      if (typeof data.character.health.max !== 'number' || data.character.health.max < 1) {
        errors.push('Health max must be a positive number');
      }
    }

    if (data.character.mana) {
      if (typeof data.character.mana.current !== 'number' || data.character.mana.current < 0) {
        errors.push('Mana current must be a non-negative number');
      }
      if (typeof data.character.mana.max !== 'number' || data.character.mana.max < 1) {
        errors.push('Mana max must be a positive number');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate map update data
 * @param {Object} data - Map update data
 * @returns {Object} { valid, errors }
 */
function validateMapUpdate(data) {
  const errors = [];

  if (!data) {
    errors.push('No data provided');
    return { valid: false, errors };
  }

  if (!data.roomId) {
    errors.push('Room ID is required');
  }

  const validActions = ['create', 'delete', 'rename'];
  if (data.action && !validActions.includes(data.action)) {
    errors.push(`Invalid action. Valid actions: ${validActions.join(', ')}`);
  }

  if (data.action === 'create' && !data.map) {
    errors.push('Map data is required for create action');
  }

  if (data.action === 'delete' && !data.mapId) {
    errors.push('Map ID is required for delete action');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Rate limit check helper
 * @param {string} identifier - Identifier to check (e.g., socketId)
 * @param {Map} rateLimitStore - Rate limit store
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} { allowed, remaining, resetTime }
 */
function checkRateLimit(identifier, rateLimitStore, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get or create entry
  let entry = rateLimitStore.get(identifier);
  
  if (!entry || entry.windowStart < windowStart) {
    // New window
    entry = {
      windowStart: now,
      count: 0,
      requests: []
    };
  }

  // Filter old requests
  entry.requests = entry.requests.filter(time => time > windowStart);
  entry.count = entry.requests.length;

  const allowed = entry.count < maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count - 1);
  const resetTime = entry.windowStart + windowMs;

  if (allowed) {
    entry.requests.push(now);
    entry.count++;
    rateLimitStore.set(identifier, entry);
  }

  return {
    allowed,
    remaining,
    resetTime,
    retryAfter: allowed ? 0 : Math.ceil((resetTime - now) / 1000)
  };
}

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @param {number} maxLength - Maximum length
 * @returns {string} Sanitized string
 */
function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  
  return input
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Validate and sanitize position object
 * @param {Object} position - Position object
 * @returns {Object|null} Sanitized position or null if invalid
 */
function validatePosition(position) {
  if (!position || typeof position !== 'object') return null;

  const x = parseFloat(position.x);
  const y = parseFloat(position.y);

  if (isNaN(x) || isNaN(y)) return null;

  return {
    x: Math.round(x * 100) / 100, // Round to 2 decimal places
    y: Math.round(y * 100) / 100
  };
}

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} Whether UUID is valid
 */
function isValidUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Create validation middleware for Socket.io
 * @param {Object} options - Validation options
 * @returns {Function} Middleware function
 */
function createValidationMiddleware(options = {}) {
  const {
    validateRoom = true,
    validatePlayer = true,
    logErrors = true
  } = options;

  return (socket, next) => {
    try {
      // Store validation results on socket
      socket.validation = {
        timestamp: Date.now(),
        passed: true
      };

      next();
    } catch (error) {
      if (logErrors) {
        logger.error('Validation middleware error:', { error: error.message });
      }
      next(new Error('Validation failed'));
    }
  };
}

module.exports = {
  validateRoomCreation,
  validateJoinRoom,
  validateTokenCreation,
  validateChatMessage,
  validateCharacterUpdate,
  validateMapUpdate,
  checkRateLimit,
  sanitizeString,
  validatePosition,
  isValidUUID,
  createValidationMiddleware
};
