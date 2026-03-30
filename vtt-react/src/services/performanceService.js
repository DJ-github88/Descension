/**
 * Performance Monitoring Service
 *
 * Comprehensive performance monitoring with Firebase usage tracking,
 * error reporting, and performance metrics collection
 */

import { getPerformance } from 'firebase/performance';
import { getApp } from 'firebase/app';
import { db } from '../config/firebase';

// Performance metrics storage
const PERFORMANCE_METRICS = {
  PAGE_LOADS: 'page_loads',
  API_CALLS: 'api_calls',
  FIREBASE_USAGE: 'firebase_usage',
  ERROR_REPORTS: 'error_reports',
  USER_INTERACTIONS: 'user_interactions',
  MEMORY_USAGE: 'memory_usage'
};

// Metrics storage keys
const METRICS_STORAGE = {
  PERFORMANCE_DATA: 'performance_data',
  ERROR_LOGS: 'error_logs',
  USAGE_STATS: 'usage_stats'
};

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
  try {
    // Initialize Firebase Performance Monitoring
    const app = getApp();
    const performance = getPerformance(app);
    console.log('Firebase Performance Monitoring initialized');

    // Set up global error handlers
    setupErrorTracking();

    // Start collecting performance metrics
    startPerformanceCollection();

    // Set up periodic cleanup
    setInterval(cleanupOldMetrics, 24 * 60 * 60 * 1000); // Daily cleanup

  } catch (error) {
    console.error('Failed to initialize performance monitoring:', error);
  }
}

/**
 * Set up global error tracking
 */
function setupErrorTracking() {
  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError('unhandled_promise_rejection', {
      reason: event.reason,
      promise: event.promise,
      stack: event.reason?.stack
    });
  });

  // Track JavaScript errors
  window.addEventListener('error', (event) => {
    logError('javascript_error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack
    });
  });

  // Track React errors (when available)
  if (window.React && window.React.ErrorInfo) {
    // This would be set up in the error boundary component
  }

  console.log('Error tracking initialized');
}

/**
 * Start collecting performance metrics
 */
function startPerformanceCollection() {
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      recordMetric('page_hidden', { timestamp: Date.now() });
    } else {
      recordMetric('page_visible', { timestamp: Date.now() });
    }
  });

  // Track memory usage periodically
  setInterval(() => {
    if (performance.memory) {
      recordMetric('memory_usage', {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });
    }
  }, 30000); // Every 30 seconds

  // Track navigation timing
  if (performance.timing) {
    window.addEventListener('load', () => {
      const timing = performance.timing;
      recordMetric('page_load_timing', {
        navigationStart: timing.navigationStart,
        loadEventEnd: timing.loadEventEnd,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        totalLoadTime: timing.loadEventEnd - timing.navigationStart,
        timestamp: Date.now()
      });
    });
  }

  console.log('Performance collection started');
}

/**
 * Record a performance metric
 */
export function recordMetric(metricType, data, userId = null) {
  try {
    const metric = {
      id: `${metricType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: metricType,
      data,
      timestamp: new Date().toISOString(),
      userId: userId || getCurrentUserId(),
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store locally
    storeMetricLocally(metric);

    // Send to server if online and configured
    if (navigator.onLine && shouldSendMetrics()) {
      sendMetricToServer(metric);
    }

  } catch (error) {
    console.error('Failed to record metric:', error);
  }
}

/**
 * Log an error
 */
export function logError(errorType, errorData, userId = null) {
  try {
    const error = {
      id: `${errorType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: errorType,
      data: errorData,
      timestamp: new Date().toISOString(),
      userId: userId || getCurrentUserId(),
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: errorData.stack || new Error().stack
    };

    // Store locally
    storeErrorLocally(error);

    // Send to server if online
    if (navigator.onLine) {
      sendErrorToServer(error);
    }

    console.error(`[${errorType}]`, errorData);

  } catch (error) {
    console.error('Failed to log error:', error);
  }
}

/**
 * Record Firebase usage
 */
export function recordFirebaseUsage(operation, collection, data = {}) {
  recordMetric('firebase_operation', {
    operation,
    collection,
    dataSize: JSON.stringify(data).length,
    timestamp: Date.now(),
    ...data
  });
}

/**
 * Record API call
 */
export function recordApiCall(endpoint, method, duration, success = true, error = null) {
  recordMetric('api_call', {
    endpoint,
    method,
    duration,
    success,
    error: error?.message,
    statusCode: error?.statusCode,
    timestamp: Date.now()
  });
}

/**
 * Record user interaction
 */
export function recordUserInteraction(interactionType, element, data = {}) {
  recordMetric('user_interaction', {
    interactionType,
    element: element?.tagName + (element?.id ? `#${element.id}` : '') + (element?.className ? `.${element.className}` : ''),
    timestamp: Date.now(),
    ...data
  });
}

/**
 * Store metric locally
 */
function storeMetricLocally(metric) {
  try {
    const metrics = getStoredMetrics();
    metrics.push(metric);

    // Keep only last 1000 metrics to prevent storage bloat
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000);
    }

    localStorage.setItem(METRICS_STORAGE.PERFORMANCE_DATA, JSON.stringify(metrics));
  } catch (error) {
    console.error('Failed to store metric locally:', error);
  }
}

/**
 * Store error locally
 */
function storeErrorLocally(error) {
  try {
    const errors = getStoredErrors();
    errors.push(error);

    // Keep only last 500 errors
    if (errors.length > 500) {
      errors.splice(0, errors.length - 500);
    }

    localStorage.setItem(METRICS_STORAGE.ERROR_LOGS, JSON.stringify(errors));
  } catch (error) {
    console.error('Failed to store error locally:', error);
  }
}

/**
 * Send metric to server
 */
async function sendMetricToServer(metric) {
  try {
    // In a real implementation, this would send to your analytics server
    // For now, we'll just log it
    console.log('Sending metric to server:', metric);

    // You could implement this to send to:
    // - Firebase Analytics
    // - Your own analytics server
    // - Third-party analytics service

  } catch (error) {
    console.error('Failed to send metric to server:', error);
  }
}

/**
 * Send error to server
 */
async function sendErrorToServer(error) {
  try {
    // In a real implementation, this would send to your error reporting service
    console.error('Sending error to server:', error);

    // You could implement this to send to:
    // - Sentry
    // - Bugsnag
    // - Firebase Crashlytics
    // - Your own error reporting server

  } catch (error) {
    console.error('Failed to send error to server:', error);
  }
}

/**
 * Get stored metrics
 */
function getStoredMetrics() {
  try {
    const data = localStorage.getItem(METRICS_STORAGE.PERFORMANCE_DATA);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get stored metrics:', error);
    return [];
  }
}

/**
 * Get stored errors
 */
function getStoredErrors() {
  try {
    const data = localStorage.getItem(METRICS_STORAGE.ERROR_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get stored errors:', error);
    return [];
  }
}

/**
 * Get current user ID
 */
function getCurrentUserId() {
  try {
    const authStore = require('../store/authStore').default;
    return authStore.getState().user?.uid || 'anonymous';
  } catch (error) {
    return 'anonymous';
  }
}

/**
 * Get session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('performance_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('performance_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Check if metrics should be sent to server
 */
function shouldSendMetrics() {
  // You can implement logic here to determine when to send metrics
  // For example, only in production, or based on user preferences
  return process.env.NODE_ENV === 'production';
}

/**
 * Clean up old metrics
 */
function cleanupOldMetrics() {
  try {
    const metrics = getStoredMetrics();
    const errors = getStoredErrors();

    // Keep only metrics from last 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentMetrics = metrics.filter(m => new Date(m.timestamp).getTime() > sevenDaysAgo);
    const recentErrors = errors.filter(e => new Date(e.timestamp).getTime() > sevenDaysAgo);

    localStorage.setItem(METRICS_STORAGE.PERFORMANCE_DATA, JSON.stringify(recentMetrics));
    localStorage.setItem(METRICS_STORAGE.ERROR_LOGS, JSON.stringify(recentErrors));

    console.log(`Cleaned up old metrics: ${metrics.length - recentMetrics.length} metrics, ${errors.length - recentErrors.length} errors`);
  } catch (error) {
    console.error('Failed to cleanup old metrics:', error);
  }
}

/**
 * Get performance statistics
 */
export function getPerformanceStats(timeRange = '24h') {
  try {
    const metrics = getStoredMetrics();
    const errors = getStoredErrors();

    // Filter by time range
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const timeThreshold = now - (timeRanges[timeRange] || timeRanges['24h']);
    const recentMetrics = metrics.filter(m => new Date(m.timestamp).getTime() > timeThreshold);
    const recentErrors = errors.filter(e => new Date(e.timestamp).getTime() > timeThreshold);

    // Calculate statistics
    const stats = {
      timeRange,
      totalMetrics: recentMetrics.length,
      totalErrors: recentErrors.length,
      metricsByType: {},
      errorsByType: {},
      averageMemoryUsage: null,
      pageLoadTimes: [],
      apiCallStats: {
        total: 0,
        success: 0,
        failure: 0,
        averageDuration: 0
      }
    };

    // Group metrics by type
    recentMetrics.forEach(metric => {
      stats.metricsByType[metric.type] = (stats.metricsByType[metric.type] || 0) + 1;

      // Collect specific data
      switch (metric.type) {
        case 'memory_usage':
          if (!stats.averageMemoryUsage) {
            stats.averageMemoryUsage = { used: [], total: [] };
          }
          stats.averageMemoryUsage.used.push(metric.data.used);
          stats.averageMemoryUsage.total.push(metric.data.total);
          break;

        case 'page_load_timing':
          stats.pageLoadTimes.push(metric.data.totalLoadTime);
          break;

        case 'api_call':
          stats.apiCallStats.total++;
          if (metric.data.success) {
            stats.apiCallStats.success++;
          } else {
            stats.apiCallStats.failure++;
          }
          stats.apiCallStats.averageDuration += metric.data.duration;
          break;
      }
    });

    // Group errors by type
    recentErrors.forEach(error => {
      stats.errorsByType[error.type] = (stats.errorsByType[error.type] || 0) + 1;
    });

    // Calculate averages
    if (stats.averageMemoryUsage) {
      stats.averageMemoryUsage.used = stats.averageMemoryUsage.used.reduce((a, b) => a + b, 0) / stats.averageMemoryUsage.used.length;
      stats.averageMemoryUsage.total = stats.averageMemoryUsage.total.reduce((a, b) => a + b, 0) / stats.averageMemoryUsage.total.length;
    }

    if (stats.pageLoadTimes.length > 0) {
      stats.averagePageLoadTime = stats.pageLoadTimes.reduce((a, b) => a + b, 0) / stats.pageLoadTimes.length;
    }

    if (stats.apiCallStats.total > 0) {
      stats.apiCallStats.averageDuration /= stats.apiCallStats.total;
    }

    return stats;
  } catch (error) {
    console.error('Failed to get performance stats:', error);
    return null;
  }
}

/**
 * Export performance data for analysis
 */
export function exportPerformanceData(timeRange = '7d') {
  try {
    const stats = getPerformanceStats(timeRange);
    const metrics = getStoredMetrics();
    const errors = getStoredErrors();

    // Filter by time range
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const timeThreshold = now - (timeRanges[timeRange] || timeRanges['7d']);
    const filteredMetrics = metrics.filter(m => new Date(m.timestamp).getTime() > timeThreshold);
    const filteredErrors = errors.filter(e => new Date(e.timestamp).getTime() > timeThreshold);

    return {
      stats,
      metrics: filteredMetrics,
      errors: filteredErrors,
      exportTime: new Date().toISOString(),
      timeRange
    };
  } catch (error) {
    console.error('Failed to export performance data:', error);
    return null;
  }
}

/**
 * Performance monitoring wrapper for functions
 */
export function withPerformanceMonitoring(fn, name, category = 'function') {
  return async (...args) => {
    const startTime = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - startTime;

      recordMetric('function_performance', {
        name,
        category,
        duration,
        success: true
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      recordMetric('function_performance', {
        name,
        category,
        duration,
        success: false,
        error: error.message
      });

      throw error;
    }
  };
}
