/**
 * Request Tracing Service
 * Adds unique request IDs to trace requests across the system
 */

const { v4: uuidv4 } = require('uuid');

class RequestTracer {
  constructor() {
    this.activeRequests = new Map(); // requestId -> { startTime, path, method }
    this.maxActiveRequests = 1000;
  }

  /**
   * Generate and attach request ID
   */
  attachRequestId(req, res, next) {
    const requestId = uuidv4();
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    
    // Store request info
    this.activeRequests.set(requestId, {
      startTime: Date.now(),
      path: req.path,
      method: req.method,
      socketId: req.headers['x-socket-id'] || null
    });
    
    // Cleanup old requests periodically
    if (this.activeRequests.size > this.maxActiveRequests) {
      this.cleanup();
    }
    
    next();
  }

  /**
   * Get request context for logging
   */
  getRequestContext(req) {
    return {
      requestId: req.requestId,
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
  }

  /**
   * Complete request tracking
   */
  completeRequest(requestId, statusCode) {
    const request = this.activeRequests.get(requestId);
    if (request) {
      const duration = Date.now() - request.startTime;
      this.activeRequests.delete(requestId);
      return {
        ...request,
        duration,
        statusCode,
        completed: true
      };
    }
    return null;
  }

  /**
   * Cleanup old requests
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    for (const [requestId, request] of this.activeRequests.entries()) {
      if (now - request.startTime > maxAge) {
        this.activeRequests.delete(requestId);
      }
    }
  }

  /**
   * Get active request count
   */
  getActiveRequestCount() {
    return this.activeRequests.size;
  }
}

module.exports = new RequestTracer();

