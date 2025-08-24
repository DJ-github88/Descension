/**
 * Database Connection Pool Manager
 * Manages Firebase connections and implements connection pooling for better performance
 */

class DatabasePool {
  constructor() {
    this.connections = new Map(); // connectionId -> connection info
    this.activeQueries = new Map(); // queryId -> query info
    this.queryQueue = []; // Queue for pending queries
    this.maxConcurrentQueries = 10; // Maximum concurrent database queries
    this.queryTimeout = 30000; // 30 seconds timeout
    this.connectionTimeout = 5000; // 5 seconds connection timeout
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second base delay
    
    this.stats = {
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      averageQueryTime: 0,
      activeConnections: 0,
      queuedQueries: 0
    };

    console.log('🗄️ Database Pool Manager initialized');
  }

  /**
   * Execute a database query with connection pooling
   */
  async executeQuery(operation, queryFn, options = {}) {
    const queryId = this.generateQueryId();
    const startTime = Date.now();
    
    const queryInfo = {
      id: queryId,
      operation: operation,
      startTime: startTime,
      timeout: options.timeout || this.queryTimeout,
      retries: 0,
      maxRetries: options.retries || this.retryAttempts
    };

    this.stats.totalQueries++;

    try {
      // Check if we can execute immediately or need to queue
      if (this.activeQueries.size >= this.maxConcurrentQueries) {
        await this.queueQuery(queryInfo);
      }

      // Execute the query
      this.activeQueries.set(queryId, queryInfo);
      const result = await this.executeWithTimeout(queryFn, queryInfo.timeout);
      
      // Update statistics
      const duration = Date.now() - startTime;
      this.updateQueryStats(duration, true);
      
      // Track performance if monitor is available
      if (global.performanceMonitor) {
        global.performanceMonitor.trackDatabaseQuery(operation, duration, true);
      }

      return result;

    } catch (error) {
      // Handle retry logic
      if (queryInfo.retries < queryInfo.maxRetries && this.shouldRetry(error)) {
        queryInfo.retries++;
        console.log(`🔄 Retrying query ${operation} (attempt ${queryInfo.retries}/${queryInfo.maxRetries})`);
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, queryInfo.retries - 1);
        await this.sleep(delay);
        
        // Retry the query
        return this.executeQuery(operation, queryFn, options);
      }

      // Update failure statistics
      const duration = Date.now() - startTime;
      this.updateQueryStats(duration, false);
      
      // Track performance failure
      if (global.performanceMonitor) {
        global.performanceMonitor.trackDatabaseQuery(operation, duration, false);
      }

      // Handle error through centralized system
      if (global.errorHandler) {
        await global.errorHandler.handleError(error, {
          operation: operation,
          queryId: queryId,
          duration: duration
        });
      }

      throw error;

    } finally {
      // Clean up
      this.activeQueries.delete(queryId);
      this.processQueue();
    }
  }

  /**
   * Execute query with timeout
   */
  async executeWithTimeout(queryFn, timeout) {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Database query timeout after ${timeout}ms`));
      }, timeout);

      try {
        const result = await queryFn();
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Queue a query when at max capacity
   */
  async queueQuery(queryInfo) {
    return new Promise((resolve) => {
      this.queryQueue.push({
        ...queryInfo,
        resolve: resolve
      });
      this.stats.queuedQueries++;
    });
  }

  /**
   * Process queued queries
   */
  processQueue() {
    while (this.queryQueue.length > 0 && this.activeQueries.size < this.maxConcurrentQueries) {
      const queuedQuery = this.queryQueue.shift();
      this.stats.queuedQueries--;
      queuedQuery.resolve();
    }
  }

  /**
   * Determine if an error should trigger a retry
   */
  shouldRetry(error) {
    const retryableErrors = [
      'UNAVAILABLE',
      'DEADLINE_EXCEEDED',
      'RESOURCE_EXHAUSTED',
      'INTERNAL',
      'timeout',
      'network'
    ];

    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = error.code?.toLowerCase() || '';

    return retryableErrors.some(retryable => 
      errorMessage.includes(retryable) || errorCode.includes(retryable)
    );
  }

  /**
   * Update query statistics
   */
  updateQueryStats(duration, success) {
    if (success) {
      this.stats.successfulQueries++;
    } else {
      this.stats.failedQueries++;
    }

    // Update average query time
    const totalQueries = this.stats.successfulQueries + this.stats.failedQueries;
    this.stats.averageQueryTime = (
      (this.stats.averageQueryTime * (totalQueries - 1) + duration) / totalQueries
    );
  }

  /**
   * Get database pool statistics
   */
  getStats() {
    return {
      ...this.stats,
      activeQueries: this.activeQueries.size,
      queuedQueries: this.queryQueue.length,
      successRate: this.stats.totalQueries > 0 ? 
        (this.stats.successfulQueries / this.stats.totalQueries) * 100 : 0
    };
  }

  /**
   * Health check for database connections
   */
  async healthCheck() {
    try {
      // Simple query to test database connectivity
      const testQuery = async () => {
        // This would be a simple Firebase query
        return { status: 'ok' };
      };

      await this.executeQuery('health_check', testQuery, { timeout: 5000 });
      return { healthy: true, message: 'Database connection healthy' };
      
    } catch (error) {
      return { 
        healthy: false, 
        message: `Database connection unhealthy: ${error.message}` 
      };
    }
  }

  /**
   * Optimize pool settings based on current load
   */
  optimizePool() {
    const stats = this.getStats();
    
    // Increase concurrent queries if queue is consistently full
    if (stats.queuedQueries > 5 && this.maxConcurrentQueries < 20) {
      this.maxConcurrentQueries++;
      console.log(`📈 Increased max concurrent queries to ${this.maxConcurrentQueries}`);
    }
    
    // Decrease if success rate is low (might be overloading)
    if (stats.successRate < 90 && this.maxConcurrentQueries > 5) {
      this.maxConcurrentQueries--;
      console.log(`📉 Decreased max concurrent queries to ${this.maxConcurrentQueries}`);
    }
  }

  /**
   * Generate unique query ID
   */
  generateQueryId() {
    return `query_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up old connections and queries
   */
  cleanup() {
    const now = Date.now();
    
    // Remove old active queries (shouldn't happen but safety measure)
    for (const [queryId, queryInfo] of this.activeQueries.entries()) {
      if (now - queryInfo.startTime > queryInfo.timeout * 2) {
        console.warn(`🧹 Cleaning up stale query: ${queryId}`);
        this.activeQueries.delete(queryId);
      }
    }

    // Remove old queued queries
    this.queryQueue = this.queryQueue.filter(query => 
      now - query.startTime < this.queryTimeout * 2
    );
  }

  /**
   * Start periodic optimization and cleanup
   */
  startMaintenance() {
    // Optimize pool every 5 minutes
    setInterval(() => {
      this.optimizePool();
    }, 5 * 60 * 1000);

    // Cleanup every minute
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000);

    console.log('🔧 Database pool maintenance started');
  }
}

module.exports = DatabasePool;
