/**
 * Production-safe logger utility
 * Reduces console spam in production while maintaining error visibility
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level based on environment
const currentLogLevel = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

/**
 * Production-safe logger
 */
export const logger = {
  /**
   * Always log errors (critical for debugging)
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Always log warnings (important for monitoring)
   */
  warn: (...args) => {
    console.warn(...args);
  },

  /**
   * Log info only in development or when explicitly enabled
   */
  info: (...args) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.log(...args);
    }
  },

  /**
   * Log debug only in development
   */
  debug: (...args) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.log(...args);
    }
  },

  /**
   * Conditional logging based on condition
   */
  conditional: (condition, level = 'info', ...args) => {
    if (condition) {
      logger[level](...args);
    }
  },

  /**
   * Throttled logging to prevent spam
   */
  throttled: (() => {
    const throttleMap = new Map();
    const THROTTLE_TIME = 5000; // 5 seconds

    return (key, level = 'info', ...args) => {
      const now = Date.now();
      const lastLog = throttleMap.get(key);

      if (!lastLog || now - lastLog > THROTTLE_TIME) {
        throttleMap.set(key, now);
        logger[level](...args);
      }
    };
  })(),

  /**
   * Performance logging
   */
  perf: (label, fn) => {
    if (!isDevelopment) {
      return fn();
    }

    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    logger.debug(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
    return result;
  },

  /**
   * Group logging for better organization
   */
  group: (label, fn) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.group(label);
      try {
        return fn();
      } finally {
        console.groupEnd();
      }
    } else {
      return fn();
    }
  }
};

/**
 * Multiplayer-specific logger with context
 */
export const multiplayerLogger = {
  socket: (message, ...args) => {
    logger.throttled('socket', 'debug', '🔌', message, ...args);
  },

  room: (message, ...args) => {
    logger.debug('🏠', message, ...args);
  },

  sync: (message, ...args) => {
    logger.throttled('sync', 'debug', '🔄', message, ...args);
  },

  error: (message, ...args) => {
    logger.error('❌ Multiplayer:', message, ...args);
  },

  warn: (message, ...args) => {
    logger.warn('⚠️ Multiplayer:', message, ...args);
  }
};

/**
 * Performance logger for monitoring
 */
export const perfLogger = {
  render: (component, fn) => {
    return logger.perf(`Render ${component}`, fn);
  },

  api: (endpoint, fn) => {
    return logger.perf(`API ${endpoint}`, fn);
  },

  db: (operation, fn) => {
    return logger.perf(`DB ${operation}`, fn);
  }
};

export default logger;
