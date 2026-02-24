/**
 * Connection Pool Service Module
 * 
 * Provides connection pooling for:
 * - Firebase connections (admin SDK)
 * - HTTP connections
 * - Socket.io adapter for Redis (optional)
 * 
 * Features:
 * - Connection reuse
 * - Connection health monitoring
 * - Automatic reconnection
 * - Load balancing support
 */

const logger = require('./logger');

/**
 * Connection Pool for managing reusable connections
 */
class ConnectionPool {
  constructor(options = {}) {
    this.maxConnections = options.maxConnections || 10;
    this.minConnections = options.minConnections || 2;
    this.idleTimeout = options.idleTimeout || 30000; // 30 seconds
    this.acquireTimeout = options.acquireTimeout || 5000; // 5 seconds
    
    this.connections = [];
    this.available = [];
    this.pending = [];
    this.connectionCount = 0;
    
    // Start idle connection cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanupIdle();
    }, this.idleTimeout);
  }

  /**
   * Create a new connection
   * @param {Function} createFn - Function to create connection
   * @returns {Promise<Object>}
   */
  async createConnection(createFn) {
    if (this.connectionCount >= this.maxConnections) {
      throw new Error('Connection pool exhausted');
    }
    
    try {
      const connection = await createFn();
      this.connectionCount++;
      
      const connectionWrapper = {
        connection,
        id: Date.now() + Math.random(),
        createdAt: Date.now(),
        lastUsed: Date.now(),
        inUse: false
      };
      
      this.connections.push(connectionWrapper);
      logger.debug(`[ConnectionPool] Created connection ${connectionWrapper.id}`);
      
      return connectionWrapper;
    } catch (error) {
      logger.error('[ConnectionPool] Failed to create connection:', error);
      throw error;
    }
  }

  /**
   * Acquire a connection from the pool
   * @param {Function} createFn - Function to create new connection if needed
   * @returns {Promise<Object>}
   */
  async acquire(createFn) {
    // Try to get an available connection
    if (this.available.length > 0) {
      const wrapper = this.available.pop();
      wrapper.inUse = true;
      wrapper.lastUsed = Date.now();
      logger.debug(`[ConnectionPool] Acquired existing connection ${wrapper.id}`);
      return wrapper;
    }
    
    // Create new connection if under limit
    if (this.connectionCount < this.maxConnections) {
      const wrapper = await this.createConnection(createFn);
      wrapper.inUse = true;
      return wrapper;
    }
    
    // Wait for available connection
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.pending.findIndex(p => p.resolve === resolve);
        if (index >= 0) {
          this.pending.splice(index, 1);
          reject(new Error('Connection acquire timeout'));
        }
      }, this.acquireTimeout);
      
      this.pending.push({
        resolve: (wrapper) => {
          clearTimeout(timeout);
          wrapper.inUse = true;
          wrapper.lastUsed = Date.now();
          resolve(wrapper);
        },
        reject
      });
    });
  }

  /**
   * Release a connection back to the pool
   * @param {Object} wrapper - Connection wrapper
   */
  release(wrapper) {
    wrapper.inUse = false;
    wrapper.lastUsed = Date.now();
    
    // If there are pending requests, give connection to first in line
    if (this.pending.length > 0) {
      const { resolve } = this.pending.shift();
      resolve(wrapper);
      return;
    }
    
    // Otherwise add to available pool
    this.available.push(wrapper);
    logger.debug(`[ConnectionPool] Released connection ${wrapper.id}`);
  }

  /**
   * Remove a connection from the pool
   * @param {Object} wrapper - Connection wrapper
   * @param {Function} destroyFn - Function to destroy connection
   */
  async destroy(wrapper, destroyFn) {
    const index = this.connections.findIndex(c => c.id === wrapper.id);
    if (index >= 0) {
      this.connections.splice(index, 1);
      this.available = this.available.filter(c => c.id !== wrapper.id);
      this.connectionCount--;
      
      if (destroyFn) {
        try {
          await destroyFn(wrapper.connection);
        } catch (error) {
          logger.error('[ConnectionPool] Error destroying connection:', error);
        }
      }
      
      logger.debug(`[ConnectionPool] Destroyed connection ${wrapper.id}`);
    }
  }

  /**
   * Clean up idle connections
   */
  cleanupIdle() {
    const now = Date.now();
    const toDestroy = [];
    
    // Don't go below minimum connections
    const canRemove = this.connectionCount - this.minConnections;
    let removed = 0;
    
    this.available.forEach(wrapper => {
      if (removed >= canRemove) return;
      
      if (now - wrapper.lastUsed > this.idleTimeout) {
        toDestroy.push(wrapper);
        removed++;
      }
    });
    
    toDestroy.forEach(wrapper => {
      this.destroy(wrapper);
    });
    
    if (toDestroy.length > 0) {
      logger.debug(`[ConnectionPool] Cleaned up ${toDestroy.length} idle connections`);
    }
  }

  /**
   * Get pool statistics
   * @returns {Object}
   */
  getStats() {
    return {
      total: this.connectionCount,
      available: this.available.length,
      inUse: this.connectionCount - this.available.length,
      pending: this.pending.length,
      maxConnections: this.maxConnections,
      minConnections: this.minConnections
    };
  }

  /**
   * Drain all connections
   * @param {Function} destroyFn - Function to destroy each connection
   */
  async drain(destroyFn) {
    logger.info('[ConnectionPool] Draining all connections');
    
    // Clear cleanup interval
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    // Reject all pending
    this.pending.forEach(({ reject }) => {
      reject(new Error('Pool is being drained'));
    });
    this.pending = [];
    
    // Destroy all connections
    const destroyPromises = this.connections.map(wrapper => 
      this.destroy(wrapper, destroyFn)
    );
    
    await Promise.all(destroyPromises);
    
    this.connections = [];
    this.available = [];
    this.connectionCount = 0;
  }
}

/**
 * HTTP Connection Manager
 * Manages HTTP keep-alive connections
 */
class HTTPConnectionManager {
  constructor() {
    this.agents = new Map();
  }

  /**
   * Get or create HTTP agent for a host
   * @param {string} host - Host URL
   * @param {Object} options - Agent options
   * @returns {Object}
   */
  getAgent(host, options = {}) {
    if (!this.agents.has(host)) {
      const http = require('http');
      const https = require('https');
      
      const isHttps = host.startsWith('https');
      const AgentClass = isHttps ? https.Agent : http.Agent;
      
      const agent = new AgentClass({
        keepAlive: true,
        keepAliveMsecs: 30000,
        maxSockets: options.maxSockets || 50,
        maxFreeSockets: options.maxFreeSockets || 10,
        timeout: options.timeout || 30000
      });
      
      this.agents.set(host, agent);
      logger.debug(`[HTTPConnectionManager] Created agent for ${host}`);
    }
    
    return this.agents.get(host);
  }

  /**
   * Destroy all agents
   */
  destroyAll() {
    this.agents.forEach((agent, host) => {
      agent.destroy();
      logger.debug(`[HTTPConnectionManager] Destroyed agent for ${host}`);
    });
    this.agents.clear();
  }

  /**
   * Get statistics
   * @returns {Object}
   */
  getStats() {
    const stats = {
      agentCount: this.agents.size,
      agents: {}
    };
    
    this.agents.forEach((agent, host) => {
      stats.agents[host] = {
        sockets: Object.keys(agent.sockets || {}).length,
        requests: Object.keys(agent.requests || {}).length
      };
    });
    
    return stats;
  }
}

/**
 * Socket.io Redis Adapter Configuration
 * For multi-server scaling
 */
function createRedisAdapter(options = {}) {
  const redisHost = options.host || process.env.REDIS_HOST || 'localhost';
  const redisPort = options.port || process.env.REDIS_PORT || 6379;
  
  // Only configure if Redis is available
  if (process.env.REDIS_URL || process.env.REDIS_HOST) {
    try {
      const { createAdapter } = require('@socket.io/redis-adapter');
      const { createClient } = require('redis');
      
      const pubClient = createClient({
        url: process.env.REDIS_URL || `redis://${redisHost}:${redisPort}`
      });
      
      const subClient = pubClient.duplicate();
      
      logger.info('[RedisAdapter] Configured Redis adapter for Socket.io');
      
      return {
        adapter: createAdapter(pubClient, subClient),
        pubClient,
        subClient
      };
    } catch (error) {
      logger.warn('[RedisAdapter] Redis adapter not available:', error.message);
      return null;
    }
  }
  
  return null;
}

/**
 * Connection Health Monitor
 */
class ConnectionHealthMonitor {
  constructor(checkInterval = 60000) {
    this.checkInterval = checkInterval;
    this.interval = null;
    this.checks = [];
  }

  /**
   * Register a health check function
   * @param {string} name - Check name
   * @param {Function} checkFn - Async function that returns boolean
   */
  registerCheck(name, checkFn) {
    this.checks.push({ name, checkFn });
  }

  /**
   * Start monitoring
   */
  start() {
    this.interval = setInterval(async () => {
      const results = await this.runChecks();
      logger.debug('[ConnectionHealthMonitor] Health check results:', results);
    }, this.checkInterval);
  }

  /**
   * Run all health checks
   * @returns {Promise<Object>}
   */
  async runChecks() {
    const results = {};
    
    for (const { name, checkFn } of this.checks) {
      try {
        const healthy = await checkFn();
        results[name] = { healthy, error: null };
      } catch (error) {
        results[name] = { healthy: false, error: error.message };
      }
    }
    
    return results;
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// Create singleton instances
const httpConnectionManager = new HTTPConnectionManager();
const connectionHealthMonitor = new ConnectionHealthMonitor();

// Register default health checks
connectionHealthMonitor.registerCheck('firebase', async () => {
  const firebaseService = require('./firebaseService');
  return firebaseService.isConfigured;
});

module.exports = {
  ConnectionPool,
  HTTPConnectionManager,
  ConnectionHealthMonitor,
  createRedisAdapter,
  httpConnectionManager,
  connectionHealthMonitor
};
