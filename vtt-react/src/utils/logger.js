const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

export const logger = {
  error: (...args) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(...args);
    }
  },

  warn: (...args) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(...args);
    }
  },

  info: (...args) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.log(...args);
    }
  },

  debug: (...args) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.log(...args);
    }
  },

  conditional: (condition, level = 'info', ...args) => {
    if (condition) {
      logger[level](...args);
    }
  },

  throttled: (() => {
    const throttleMap = new Map();
    const THROTTLE_TIME = 5000;

    return (key, level = 'info', ...args) => {
      const now = Date.now();
      const lastLog = throttleMap.get(key);

      if (!lastLog || now - lastLog > THROTTLE_TIME) {
        throttleMap.set(key, now);
        logger[level](...args);
      }
    };
  })(),

  perf: (label, fn) => {
    if (!isDevelopment) {
      return fn();
    }

    const start = performance.now();
    const result = fn();
    const end = performance.now();

    logger.debug(`${label} took ${(end - start).toFixed(2)}ms`);
    return result;
  },

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

export const multiplayerLogger = {
  socket: (message, ...args) => {
    logger.throttled('socket', 'debug', message, ...args);
  },

  room: (message, ...args) => {
    logger.debug(message, ...args);
  },

  sync: (message, ...args) => {
    logger.throttled('sync', 'debug', message, ...args);
  },

  error: (message, ...args) => {
    logger.error('Multiplayer:', message, ...args);
  },

  warn: (message, ...args) => {
    logger.warn('Multiplayer:', message, ...args);
  }
};

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
