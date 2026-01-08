/**
 * Lightweight Structured Logger
 * Performance-optimized logging that doesn't block the event loop
 */

const fs = require('fs').promises;
const path = require('path');

class Logger {
  constructor() {
    this.logDirectory = path.join(__dirname, '../logs');
    this.logBuffer = [];
    this.bufferSize = 50; // Flush every 50 logs
    this.flushInterval = 5000; // Or every 5 seconds
    this.maxLogFiles = 7; // Keep 7 days of logs
    this.initialize();
  }

  async initialize() {
    try {
      await fs.mkdir(this.logDirectory, { recursive: true });
      
      // Start periodic flush
      setInterval(() => this.flush(), this.flushInterval);
      
      // Cleanup old logs on startup
      this.cleanupOldLogs();
      
      console.log('📝 Logger initialized');
    } catch (error) {
      console.error('Failed to initialize logger:', error);
    }
  }

  /**
   * Create structured log entry
   */
  createLogEntry(level, message, context = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
      pid: process.pid,
      env: process.env.NODE_ENV || 'development'
    };
  }

  /**
   * Add log to buffer (non-blocking)
   */
  log(level, message, context = {}) {
    const entry = this.createLogEntry(level, message, context);
    
    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warn' ? console.warn : 
                           level === 'info' ? console.info : console.log;
      consoleMethod(`[${level.toUpperCase()}] ${message}`, context);
    }
    
    // Add to buffer (non-blocking)
    this.logBuffer.push(entry);
    
    // Flush if buffer is full
    if (this.logBuffer.length >= this.bufferSize) {
      setImmediate(() => this.flush());
    }
  }

  /**
   * Flush buffer to disk (async, non-blocking)
   */
  async flush() {
    if (this.logBuffer.length === 0) return;
    
    const logsToWrite = [...this.logBuffer];
    this.logBuffer = [];
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logDirectory, `app-${today}.log`);
      const logLines = logsToWrite.map(entry => 
        JSON.stringify(entry) + '\n'
      ).join('');
      
      await fs.appendFile(logFile, logLines);
    } catch (error) {
      // If file write fails, put logs back in buffer (except errors)
      console.error('Failed to write logs:', error);
      this.logBuffer.unshift(...logsToWrite.filter(l => l.level === 'error'));
    }
  }

  /**
   * Clean up old log files
   */
  async cleanupOldLogs() {
    try {
      const files = await fs.readdir(this.logDirectory);
      const now = Date.now();
      const maxAge = this.maxLogFiles * 24 * 60 * 60 * 1000;
      
      for (const file of files) {
        const filePath = path.join(this.logDirectory, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          this.info('Cleaned up old log file', { file });
        }
      }
    } catch (error) {
      // Non-critical, just log it
      console.error('Failed to cleanup old logs:', error);
    }
  }

  // Convenience methods
  error(message, context) {
    this.log('error', message, context);
  }

  warn(message, context) {
    this.log('warn', message, context);
  }

  info(message, context) {
    this.log('info', message, context);
  }

  debug(message, context) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context);
    }
  }

  /**
   * Log with request context (for tracing)
   */
  logRequest(req, res, duration, success) {
    this.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      success,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  }

  /**
   * Log with socket context (for multiplayer tracing)
   */
  logSocket(event, socketId, roomId, playerId, data = {}) {
    this.debug('Socket Event', {
      event,
      socketId,
      roomId,
      playerId,
      ...data
    });
  }

  /**
   * Get recent logs for debugging (last N entries)
   */
  async getRecentLogs(limit = 100, level = null) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logDirectory, `app-${today}.log`);
      
      const content = await fs.readFile(logFile, 'utf-8');
      const lines = content.trim().split('\n').filter(l => l);
      
      let logs = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => log !== null);
      
      if (level) {
        logs = logs.filter(log => log.level === level);
      }
      
      return logs.slice(-limit);
    } catch (error) {
      return [];
    }
  }
}

// Singleton instance
const logger = new Logger();

module.exports = logger;

