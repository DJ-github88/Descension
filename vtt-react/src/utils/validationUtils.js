/**
 * Input Validation Utilities
 *
 * Provides comprehensive input validation for security and data integrity
 */

const VALIDATION_RULES = {
  // File validation
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: {
      AVATAR: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      MAP: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      DOCUMENT: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }
  },

  // Text validation
  TEXT: {
    MAX_LENGTH: {
      NAME: 100,
      DESCRIPTION: 1000,
      BIO: 500,
      TITLE: 50
    },
    MIN_LENGTH: {
      NAME: 1,
      DESCRIPTION: 0
    }
  },

  // Rate limiting
  RATE_LIMIT: {
    DICE_ROLLS: { maxPerMinute: 60, maxPerHour: 300 },
    API_CALLS: { maxPerMinute: 120, maxPerHour: 1000 }
  }
};

/**
 * Validate file upload
 */
export function validateFileUpload(file, type = 'AVATAR') {
  const errors = [];

  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  // Check file type
  const allowedTypes = VALIDATION_RULES.FILE.ALLOWED_TYPES[type];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check file size
  if (file.size > VALIDATION_RULES.FILE.MAX_SIZE) {
    const maxSizeMB = VALIDATION_RULES.FILE.MAX_SIZE / (1024 * 1024);
    errors.push(`File too large. Maximum size: ${maxSizeMB}MB`);
  }

  // Additional security checks
  if (file.name) {
    // Check for dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.jar', '.js', '.vbs'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (dangerousExtensions.includes(fileExtension)) {
      errors.push('Dangerous file type not allowed');
    }

    // Check filename length
    if (file.name.length > 255) {
      errors.push('Filename too long');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize and validate text input
 */
export function validateTextInput(text, type = 'NAME', options = {}) {
  const errors = [];
  const rules = VALIDATION_RULES.TEXT;

  if (typeof text !== 'string') {
    errors.push('Input must be a string');
    return { isValid: false, errors, sanitized: '' };
  }

  let sanitized = text.trim();

  // Length validation
  const maxLength = options.maxLength || rules.MAX_LENGTH[type] || 1000;
  const minLength = options.minLength || rules.MIN_LENGTH[type] || 0;

  if (sanitized.length < minLength) {
    errors.push(`Text too short. Minimum length: ${minLength} characters`);
  }

  if (sanitized.length > maxLength) {
    errors.push(`Text too long. Maximum length: ${maxLength} characters`);
    sanitized = sanitized.substring(0, maxLength);
  }

  // Basic sanitization - remove potentially dangerous characters
  if (options.allowHtml !== true) {
    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Remove script tags and javascript: protocols
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+=/gi, '');
  }

  // Remove null bytes and other control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // For names and titles, additional restrictions
  if (['NAME', 'TITLE'].includes(type)) {
    // Remove excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ');

    // Check for reserved words or inappropriate content
    const reservedWords = ['admin', 'system', 'null', 'undefined', 'root'];
    const lowerSanitized = sanitized.toLowerCase();
    if (reservedWords.some(word => lowerSanitized.includes(word))) {
      errors.push('Text contains reserved words');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Validate campaign/room names
 */
export function validateCampaignName(name) {
  return validateTextInput(name, 'NAME', {
    maxLength: 50,
    minLength: 1
  });
}

export function validateRoomName(name) {
  return validateTextInput(name, 'NAME', {
    maxLength: 50,
    minLength: 1
  });
}

/**
 * Rate limiting utility
 */
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  checkLimit(key, limits) {
    const now = Date.now();
    const windowStart = now - (limits.windowMs || 60000); // Default 1 minute

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const userRequests = this.requests.get(key);

    // Remove old requests outside the window
    const validRequests = userRequests.filter(req => req > windowStart);
    this.requests.set(key, validRequests);

    // Check if under limit
    if (validRequests.length >= limits.max) {
      return { allowed: false, remainingTime: limits.windowMs - (now - validRequests[0]) };
    }

    // Add current request
    validRequests.push(now);

    return { allowed: true, remainingRequests: limits.max - validRequests.length };
  }

  cleanup() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(req => req > oneHourAgo);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Cleanup old entries every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

/**
 * Check rate limit for dice rolls
 */
export function checkDiceRollRateLimit(userId) {
  return rateLimiter.checkLimit(`dice_${userId}`, {
    max: VALIDATION_RULES.RATE_LIMIT.DICE_ROLLS.maxPerMinute,
    windowMs: 60000 // 1 minute
  });
}

/**
 * Check rate limit for API calls
 */
export function checkApiRateLimit(userId, endpoint = 'general') {
  return rateLimiter.checkLimit(`api_${endpoint}_${userId}`, {
    max: VALIDATION_RULES.RATE_LIMIT.API_CALLS.maxPerMinute,
    windowMs: 60000 // 1 minute
  });
}

/**
 * Validate and sanitize user input data
 */
export function sanitizeUserInput(data, schema) {
  const sanitized = {};
  const errors = [];

  Object.keys(schema).forEach(field => {
    const fieldSchema = schema[field];
    const value = data[field];

    if (fieldSchema.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      return;
    }

    if (value !== undefined && value !== null) {
      switch (fieldSchema.type) {
        case 'string':
          const textValidation = validateTextInput(value, fieldSchema.textType, fieldSchema.options);
          if (!textValidation.isValid) {
            errors.push(...textValidation.errors.map(err => `${field}: ${err}`));
          } else {
            sanitized[field] = textValidation.sanitized;
          }
          break;

        case 'file':
          if (value instanceof File) {
            const fileValidation = validateFileUpload(value, fieldSchema.fileType);
            if (!fileValidation.isValid) {
              errors.push(...fileValidation.errors.map(err => `${field}: ${err}`));
            } else {
              sanitized[field] = value;
            }
          } else {
            sanitized[field] = value;
          }
          break;

        default:
          sanitized[field] = value;
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}
