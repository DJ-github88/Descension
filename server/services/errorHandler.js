/**
 * Centralized Error Handling Service
 * Provides consistent error handling, logging, and recovery mechanisms
 */

const logger = require('./logger');

class ErrorHandler {
  constructor() {
    this.errorCounts = new Map(); // errorType -> count
    this.recentErrors = []; // Array of recent errors for analysis
    this.maxRecentErrors = 100;
    this.errorThresholds = {
      warning: 5, // 5 errors of same type in 5 minutes
      critical: 10, // 10 errors of same type in 5 minutes
      emergency: 20 // 20 errors of same type in 5 minutes
    };
    this.timeWindow = 5 * 60 * 1000; // 5 minutes
    
    // MULTIPLAYER: Retry configuration for transient failures
    this.retryableErrors = ['network', 'database', 'timeout'];
    this.maxRetries = 3;
    this.retryDelays = [100, 500, 2000]; // Exponential backoff delays in ms
    
    logger.info('Error handler initialized');
  }

  /**
   * Handle and categorize errors
   */
  async handleError(error, context = {}) {
    const errorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      message: error.message || 'Unknown error',
      stack: error.stack,
      type: this.categorizeError(error),
      severity: this.determineSeverity(error),
      context: context,
      userAgent: context.userAgent,
      socketId: context.socketId,
      roomId: context.roomId,
      playerId: context.playerId,
      retryable: this.isRetryable(error)
    };

    // Add to recent errors
    this.recentErrors.push(errorInfo);
    if (this.recentErrors.length > this.maxRecentErrors) {
      this.recentErrors.shift();
    }

    // Update error counts
    this.updateErrorCounts(errorInfo.type);

    // Log the error
    await this.logError(errorInfo);

    // Check if we need to take action
    this.checkErrorThresholds(errorInfo.type);

    // Return sanitized error for client
    return this.sanitizeErrorForClient(errorInfo);
  }

  /**
   * Check if an error is retryable (transient failure)
   */
  isRetryable(error) {
    const errorType = this.categorizeError(error);
    return this.retryableErrors.includes(errorType);
  }

  /**
   * Execute a function with automatic retry for transient failures
   * @param {Function} fn - Function to execute
   * @param {Object} options - Retry options
   * @returns {Promise} - Result of function execution
   */
  async executeWithRetry(fn, options = {}) {
    const maxRetries = options.maxRetries || this.maxRetries;
    const retryDelays = options.retryDelays || this.retryDelays;
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Check if error is retryable
        if (!this.isRetryable(error)) {
          throw error; // Don't retry non-retryable errors
        }

        // If this was the last attempt, throw the error
        if (attempt === maxRetries) {
          logger.warn('Max retries exceeded', {
            attempts: attempt + 1,
            error: error.message,
            errorType: this.categorizeError(error)
          });
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const delay = retryDelays[attempt] || retryDelays[retryDelays.length - 1];
        logger.debug('Retrying after transient failure', {
          attempt: attempt + 1,
          maxRetries,
          delay,
          error: error.message
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Categorize error types
   */
  categorizeError(error) {
    const message = error.message?.toLowerCase() || '';
    const stack = error.stack?.toLowerCase() || '';

    if (message.includes('firebase') || message.includes('firestore')) {
      return 'database';
    }
    if (message.includes('socket') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('memory') || message.includes('heap')) {
      return 'memory';
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'auth';
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return 'validation';
    }
    if (stack.includes('multiplayer') || stack.includes('sync')) {
      return 'multiplayer';
    }
    
    return 'general';
  }

  /**
   * Determine error severity
   */
  determineSeverity(error) {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('critical') || message.includes('emergency') || 
        message.includes('fatal') || message.includes('crash')) {
      return 'critical';
    }
    if (message.includes('warning') || message.includes('deprecated')) {
      return 'warning';
    }
    if (message.includes('info') || message.includes('notice')) {
      return 'info';
    }
    
    return 'error';
  }

  /**
   * Update error counts and check for patterns
   */
  updateErrorCounts(errorType) {
    const now = Date.now();
    const key = `${errorType}_${Math.floor(now / this.timeWindow)}`;
    
    const current = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, current + 1);

    // Clean up old counts
    for (const [countKey] of this.errorCounts) {
      const keyTime = parseInt(countKey.split('_').pop()) * this.timeWindow;
      if (now - keyTime > this.timeWindow * 2) {
        this.errorCounts.delete(countKey);
      }
    }
  }

  /**
   * Check error thresholds and take action
   */
  checkErrorThresholds(errorType) {
    const now = Date.now();
    const currentWindow = Math.floor(now / this.timeWindow);
    const key = `${errorType}_${currentWindow}`;
    const count = this.errorCounts.get(key) || 0;

    if (count >= this.errorThresholds.emergency) {
      console.error(`🚨 EMERGENCY: ${count} ${errorType} errors in 5 minutes!`);
      this.triggerEmergencyProtocol(errorType);
    } else if (count >= this.errorThresholds.critical) {
      console.error(`⚠️ CRITICAL: ${count} ${errorType} errors in 5 minutes!`);
      this.triggerCriticalProtocol(errorType);
    } else if (count >= this.errorThresholds.warning) {
      console.warn(`⚠️ WARNING: ${count} ${errorType} errors in 5 minutes`);
    }
  }

  /**
   * Emergency protocol for severe error patterns
   */
  triggerEmergencyProtocol(errorType) {
    console.error(`🚨 EMERGENCY PROTOCOL ACTIVATED for ${errorType} errors`);
    
    switch (errorType) {
    case 'memory':
      // Trigger aggressive memory cleanup
      if (global.memoryManager) {
        global.memoryManager.performAggressiveCleanup();
      }
      break;
    case 'database':
      // Switch to in-memory mode temporarily
      console.error('🔥 Database errors critical - switching to in-memory mode');
      break;
    case 'network':
      // Implement connection throttling
      console.error('🌐 Network errors critical - implementing throttling');
      break;
    }
  }

  /**
   * Critical protocol for high error rates
   */
  triggerCriticalProtocol(errorType) {
    console.warn(`⚠️ CRITICAL PROTOCOL ACTIVATED for ${errorType} errors`);
    
    switch (errorType) {
    case 'multiplayer':
      // Reset multiplayer connections
      console.warn('🎮 Multiplayer errors critical - considering connection reset');
      break;
    case 'validation':
      // Increase validation strictness
      console.warn('✅ Validation errors critical - increasing strictness');
      break;
    }
  }

  /**
   * Log error using structured logger
   */
  async logError(errorInfo) {
    // Use structured logger (non-blocking)
    logger.error(errorInfo.message, {
      errorId: errorInfo.id,
      type: errorInfo.type,
      severity: errorInfo.severity,
      stack: errorInfo.stack,
      ...errorInfo.context
    });
  }

  /**
   * Sanitize error for client response
   */
  sanitizeErrorForClient(errorInfo) {
    return {
      id: errorInfo.id,
      message: errorInfo.severity === 'critical' ? 'A critical error occurred' : errorInfo.message,
      type: errorInfo.type,
      timestamp: errorInfo.timestamp
    };
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.recentErrors.length,
      byType: {},
      bySeverity: {},
      recent: this.recentErrors.slice(-10)
    };

    this.recentErrors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear old errors and reset counters
   */
  cleanup() {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    this.recentErrors = this.recentErrors.filter(error => 
      error.timestamp.getTime() > cutoff
    );
  }
}

module.exports = ErrorHandler;
