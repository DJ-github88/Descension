/**
 * Multiplayer Performance Optimizer
 * 
 * Advanced performance optimization utilities for multiplayer gaming
 * Includes adaptive throttling, memory management, and frame rate optimization
 */

class MultiplayerPerformanceOptimizer {
  constructor() {
    this.performanceMetrics = {
      frameDrops: 0,
      memoryUsage: 0,
      networkLatency: 50,
      lastCheck: Date.now(),
      adaptiveSettings: {
        throttleRate: 50,
        batchSize: 3,
        maxQueueSize: 100
      }
    };
    
    this.updateQueue = new Map();
    this.throttleTimers = new Map();
    this.memoryCleanupInterval = null;
    
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Monitor memory usage
    if (performance.memory) {
      this.memoryCleanupInterval = setInterval(() => {
        this.checkMemoryUsage();
      }, 10000); // Check every 10 seconds
    }

    // Monitor frame rate
    this.startFrameRateMonitoring();
  }

  /**
   * Start frame rate monitoring
   */
  startFrameRateMonitoring() {
    let lastFrameTime = performance.now();
    let frameCount = 0;
    
    const monitorFrame = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastFrameTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastFrameTime = currentTime;
        
        // Adjust performance settings based on FPS
        this.adjustPerformanceSettings(fps);
      }
      
      requestAnimationFrame(monitorFrame);
    };
    
    requestAnimationFrame(monitorFrame);
  }

  /**
   * Adjust performance settings based on current FPS
   */
  adjustPerformanceSettings(fps) {
    const settings = this.performanceMetrics.adaptiveSettings;
    
    if (fps < 30) {
      // Low FPS - reduce load
      settings.throttleRate = Math.min(100, settings.throttleRate + 10);
      settings.batchSize = Math.max(1, settings.batchSize - 1);
      settings.maxQueueSize = Math.max(50, settings.maxQueueSize - 10);
      console.log('🐌 Performance: Reducing load due to low FPS:', fps);
    } else if (fps > 55) {
      // High FPS - can increase performance
      settings.throttleRate = Math.max(30, settings.throttleRate - 5);
      settings.batchSize = Math.min(5, settings.batchSize + 1);
      settings.maxQueueSize = Math.min(200, settings.maxQueueSize + 10);
    }
  }

  /**
   * Check memory usage and clean up if needed
   */
  checkMemoryUsage() {
    if (!performance.memory) return;
    
    const memoryInfo = performance.memory;
    const usedMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
    const limitMB = memoryInfo.jsHeapSizeLimit / 1024 / 1024;
    const usagePercent = (usedMB / limitMB) * 100;
    
    this.performanceMetrics.memoryUsage = usagePercent;
    
    if (usagePercent > 80) {
      console.warn('⚠️ High memory usage detected:', usagePercent.toFixed(1) + '%');
      this.performMemoryCleanup();
    }
  }

  /**
   * Perform memory cleanup
   */
  performMemoryCleanup() {
    // Clear old throttle timers
    const now = Date.now();
    for (const [key, timer] of this.throttleTimers.entries()) {
      if (now - timer.created > 30000) { // 30 seconds old
        this.throttleTimers.delete(key);
      }
    }
    
    // Clear old update queue entries
    for (const [key, update] of this.updateQueue.entries()) {
      if (now - update.timestamp > 5000) { // 5 seconds old
        this.updateQueue.delete(key);
      }
    }
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    console.log('🧹 Memory cleanup completed');
  }

  /**
   * Adaptive throttle function that adjusts based on performance
   */
  adaptiveThrottle(key, callback, baseDelay = 50) {
    const now = Date.now();
    const settings = this.performanceMetrics.adaptiveSettings;
    const adaptiveDelay = Math.max(baseDelay, settings.throttleRate);
    
    const existingTimer = this.throttleTimers.get(key);
    
    if (!existingTimer || now - existingTimer.lastCall >= adaptiveDelay) {
      callback();
      this.throttleTimers.set(key, {
        lastCall: now,
        created: existingTimer?.created || now
      });
    }
  }

  /**
   * Batch updates to reduce processing overhead
   */
  batchUpdate(category, key, updateData, processor) {
    const batchKey = `${category}_${key}`;
    const settings = this.performanceMetrics.adaptiveSettings;
    
    if (!this.updateQueue.has(batchKey)) {
      this.updateQueue.set(batchKey, {
        updates: [],
        timestamp: Date.now(),
        processor: processor
      });
    }
    
    const batch = this.updateQueue.get(batchKey);
    batch.updates.push(updateData);
    
    // Process batch when it reaches optimal size or after timeout
    if (batch.updates.length >= settings.batchSize || 
        Date.now() - batch.timestamp > 100) {
      this.processBatch(batchKey);
    }
  }

  /**
   * Process a batch of updates
   */
  processBatch(batchKey) {
    const batch = this.updateQueue.get(batchKey);
    if (!batch || batch.updates.length === 0) return;
    
    // Process all updates in the batch
    requestAnimationFrame(() => {
      batch.processor(batch.updates);
      this.updateQueue.delete(batchKey);
    });
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      queueSize: this.updateQueue.size,
      throttleTimers: this.throttleTimers.size
    };
  }

  /**
   * Optimize network updates based on connection quality
   */
  optimizeNetworkUpdates(latency, packetLoss = 0) {
    this.performanceMetrics.networkLatency = latency;
    const settings = this.performanceMetrics.adaptiveSettings;
    
    if (latency > 100 || packetLoss > 0.02) {
      // Poor connection - reduce update frequency
      settings.throttleRate = Math.min(150, settings.throttleRate + 20);
      console.log('🌐 Network: Reducing update frequency due to poor connection');
    } else if (latency < 50 && packetLoss < 0.01) {
      // Good connection - can increase frequency
      settings.throttleRate = Math.max(30, settings.throttleRate - 10);
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.memoryCleanupInterval) {
      clearInterval(this.memoryCleanupInterval);
    }
    
    this.updateQueue.clear();
    this.throttleTimers.clear();
  }
}

// Create singleton instance
const multiplayerPerformanceOptimizer = new MultiplayerPerformanceOptimizer();

export default multiplayerPerformanceOptimizer;
