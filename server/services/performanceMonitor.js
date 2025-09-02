/**
 * Performance Monitoring Service
 * Tracks server performance metrics and provides optimization recommendations
 */

const os = require('os');
const process = require('process');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      cpu: [],
      memory: [],
      eventLoop: [],
      requests: [],
      database: [],
      websocket: []
    };
    
    this.thresholds = {
      cpu: 80, // 80% CPU usage
      memory: 85, // 85% memory usage
      eventLoopDelay: 100, // 100ms event loop delay
      responseTime: 1000, // 1 second response time
      databaseQuery: 500 // 500ms database query time
    };

    this.maxMetricsHistory = 1000; // Keep last 1000 measurements
    this.monitoringInterval = 5000; // 5 seconds
    this.alertCooldown = 60000; // 1 minute between alerts
    this.lastAlerts = new Map();

    // Performance monitoring disabled for better multiplayer performance
    // this.startMonitoring();
    console.log('📊 Performance Monitor initialized (monitoring disabled for performance)');
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring() {
    // Monitor system metrics
    setInterval(() => {
      this.collectSystemMetrics();
    }, this.monitoringInterval);

    // Monitor event loop
    this.monitorEventLoop();

    console.log('🔍 Performance monitoring started');
  }

  /**
   * Collect system performance metrics
   */
  collectSystemMetrics() {
    const timestamp = Date.now();

    // CPU Usage
    const cpuUsage = process.cpuUsage();
    const cpuPercent = this.calculateCPUPercent(cpuUsage);
    this.addMetric('cpu', {
      timestamp,
      usage: cpuPercent,
      user: cpuUsage.user,
      system: cpuUsage.system
    });

    // Memory Usage
    const memUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryPercent = ((totalMemory - freeMemory) / totalMemory) * 100;

    this.addMetric('memory', {
      timestamp,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      systemPercent: memoryPercent,
      systemTotal: totalMemory,
      systemFree: freeMemory
    });

    // Check thresholds
    this.checkThresholds(cpuPercent, memoryPercent);
  }

  /**
   * Calculate CPU percentage
   */
  calculateCPUPercent(cpuUsage) {
    if (!this.lastCPUUsage) {
      this.lastCPUUsage = cpuUsage;
      return 0;
    }

    const userDiff = cpuUsage.user - this.lastCPUUsage.user;
    const systemDiff = cpuUsage.system - this.lastCPUUsage.system;
    const totalDiff = userDiff + systemDiff;

    this.lastCPUUsage = cpuUsage;

    // Convert microseconds to percentage
    return (totalDiff / (this.monitoringInterval * 1000)) * 100;
  }

  /**
   * Monitor event loop delay
   */
  monitorEventLoop() {
    const start = process.hrtime.bigint();
    
    setImmediate(() => {
      const delay = Number(process.hrtime.bigint() - start) / 1000000; // Convert to milliseconds
      
      this.addMetric('eventLoop', {
        timestamp: Date.now(),
        delay: delay
      });

      if (delay > this.thresholds.eventLoopDelay) {
        this.triggerAlert('eventLoop', `Event loop delay: ${delay.toFixed(2)}ms`);
      }

      // Schedule next measurement
      setTimeout(() => this.monitorEventLoop(), this.monitoringInterval);
    });
  }

  /**
   * Track request performance
   */
  trackRequest(endpoint, duration, success = true) {
    this.addMetric('requests', {
      timestamp: Date.now(),
      endpoint,
      duration,
      success
    });

    if (duration > this.thresholds.responseTime) {
      this.triggerAlert('requests', `Slow request: ${endpoint} took ${duration}ms`);
    }
  }

  /**
   * Track database query performance
   */
  trackDatabaseQuery(operation, duration, success = true) {
    this.addMetric('database', {
      timestamp: Date.now(),
      operation,
      duration,
      success
    });

    if (duration > this.thresholds.databaseQuery) {
      this.triggerAlert('database', `Slow database query: ${operation} took ${duration}ms`);
    }
  }

  /**
   * Track WebSocket performance
   */
  trackWebSocketEvent(event, duration, playerCount) {
    this.addMetric('websocket', {
      timestamp: Date.now(),
      event,
      duration,
      playerCount
    });
  }

  /**
   * Add metric to history
   */
  addMetric(type, data) {
    if (!this.metrics[type]) {
      this.metrics[type] = [];
    }

    this.metrics[type].push(data);

    // Limit history size
    if (this.metrics[type].length > this.maxMetricsHistory) {
      this.metrics[type].shift();
    }
  }

  /**
   * Check performance thresholds
   */
  checkThresholds(cpuPercent, memoryPercent) {
    if (cpuPercent > this.thresholds.cpu) {
      this.triggerAlert('cpu', `High CPU usage: ${cpuPercent.toFixed(2)}%`);
    }

    if (memoryPercent > this.thresholds.memory) {
      this.triggerAlert('memory', `High memory usage: ${memoryPercent.toFixed(2)}%`);
    }
  }

  /**
   * Trigger performance alert
   */
  triggerAlert(type, message) {
    const now = Date.now();
    const lastAlert = this.lastAlerts.get(type) || 0;

    if (now - lastAlert > this.alertCooldown) {
      console.warn(`⚠️ PERFORMANCE ALERT [${type.toUpperCase()}]: ${message}`);
      this.lastAlerts.set(type, now);

      // Take corrective action if needed
      this.takeCorrectiveAction(type);
    }
  }

  /**
   * Take corrective action based on alert type
   */
  takeCorrectiveAction(type) {
    switch (type) {
      case 'memory':
        if (global.memoryManager) {
          console.log('🧹 Triggering memory cleanup due to high usage');
          global.memoryManager.performCleanupCycle();
        }
        break;
      case 'cpu':
        console.log('🔄 High CPU detected - consider reducing processing load');
        break;
      case 'eventLoop':
        console.log('⏱️ Event loop delay detected - reducing concurrent operations');
        break;
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const now = Date.now();
    const timeWindow = 5 * 60 * 1000; // 5 minutes

    const summary = {
      timestamp: now,
      cpu: this.getMetricSummary('cpu', timeWindow),
      memory: this.getMetricSummary('memory', timeWindow),
      eventLoop: this.getMetricSummary('eventLoop', timeWindow),
      requests: this.getMetricSummary('requests', timeWindow),
      database: this.getMetricSummary('database', timeWindow),
      websocket: this.getMetricSummary('websocket', timeWindow)
    };

    return summary;
  }

  /**
   * Get summary for specific metric type
   */
  getMetricSummary(type, timeWindow) {
    const now = Date.now();
    const recentMetrics = this.metrics[type].filter(
      metric => now - metric.timestamp <= timeWindow
    );

    if (recentMetrics.length === 0) {
      return { count: 0 };
    }

    const summary = {
      count: recentMetrics.length,
      latest: recentMetrics[recentMetrics.length - 1]
    };

    // Type-specific calculations
    switch (type) {
      case 'cpu':
        const cpuValues = recentMetrics.map(m => m.usage);
        summary.average = cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length;
        summary.max = Math.max(...cpuValues);
        break;

      case 'memory':
        const memValues = recentMetrics.map(m => m.systemPercent);
        summary.average = memValues.reduce((a, b) => a + b, 0) / memValues.length;
        summary.max = Math.max(...memValues);
        summary.heapUsed = summary.latest.heapUsed;
        break;

      case 'eventLoop':
        const delays = recentMetrics.map(m => m.delay);
        summary.average = delays.reduce((a, b) => a + b, 0) / delays.length;
        summary.max = Math.max(...delays);
        break;

      case 'requests':
        const durations = recentMetrics.map(m => m.duration);
        summary.average = durations.reduce((a, b) => a + b, 0) / durations.length;
        summary.max = Math.max(...durations);
        summary.successRate = recentMetrics.filter(m => m.success).length / recentMetrics.length;
        break;

      case 'database':
        const dbDurations = recentMetrics.map(m => m.duration);
        summary.average = dbDurations.reduce((a, b) => a + b, 0) / dbDurations.length;
        summary.max = Math.max(...dbDurations);
        summary.successRate = recentMetrics.filter(m => m.success).length / recentMetrics.length;
        break;
    }

    return summary;
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations() {
    const summary = this.getPerformanceSummary();
    const recommendations = [];

    if (summary.cpu.average > 70) {
      recommendations.push({
        type: 'cpu',
        priority: 'high',
        message: 'High CPU usage detected. Consider optimizing algorithms or scaling horizontally.'
      });
    }

    if (summary.memory.average > 80) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: 'High memory usage detected. Consider implementing more aggressive cleanup or increasing memory limits.'
      });
    }

    if (summary.eventLoop.average > 50) {
      recommendations.push({
        type: 'eventLoop',
        priority: 'medium',
        message: 'Event loop delays detected. Consider breaking up long-running operations.'
      });
    }

    if (summary.requests.average > 500) {
      recommendations.push({
        type: 'requests',
        priority: 'medium',
        message: 'Slow request response times. Consider caching or optimizing database queries.'
      });
    }

    return recommendations;
  }
}

module.exports = PerformanceMonitor;
