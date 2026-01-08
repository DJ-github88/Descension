/**
 * Performance utilities for optimizing rendering and event handling
 */

/**
 * Throttle function that limits how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Debounce function that delays execution until after a period of inactivity
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
    let debounceTimer;
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
};

/**
 * RequestAnimationFrame-based throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF-throttled function
 */
export const rafThrottle = (func) => {
    let rafId = null;
    return function(...args) {
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                func.apply(this, args);
                rafId = null;
            });
        }
    };
};

/**
 * Enhanced RAF throttle with pending update batching for drag operations
 * @param {Function} func - Function to throttle
 * @returns {Function} Enhanced RAF-throttled function with batching
 */
export const rafThrottleWithBatching = (func) => {
    let rafId = null;
    let pendingUpdate = null;

    return function(...args) {
        // Store the latest update
        pendingUpdate = args;

        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                if (pendingUpdate) {
                    func.apply(this, pendingUpdate);
                    pendingUpdate = null;
                }
                rafId = null;
            });
        }
    };
};

/**
 * Performance monitor for tracking render times
 */
export class PerformanceMonitor {
    constructor(name) {
        this.name = name;
        this.measurements = [];
        this.maxMeasurements = 100;
    }

    start() {
        this.startTime = performance.now();
    }

    end() {
        if (this.startTime) {
            const duration = performance.now() - this.startTime;
            this.measurements.push(duration);
            
            // Keep only recent measurements
            if (this.measurements.length > this.maxMeasurements) {
                this.measurements.shift();
            }
            
            // Track performance metrics
            if (duration > 16.67) { // More than one frame at 60fps
                // Performance monitoring - duration exceeds frame budget
            }
            
            this.startTime = null;
            return duration;
        }
        return 0;
    }

    getAverageTime() {
        if (this.measurements.length === 0) return 0;
        return this.measurements.reduce((sum, time) => sum + time, 0) / this.measurements.length;
    }

    getStats() {
        if (this.measurements.length === 0) {
            return { avg: 0, min: 0, max: 0, count: 0 };
        }
        
        return {
            avg: this.getAverageTime(),
            min: Math.min(...this.measurements),
            max: Math.max(...this.measurements),
            count: this.measurements.length
        };
    }
}

/**
 * Viewport culling utility to check if a rectangle is visible
 * @param {Object} rect - Rectangle with x, y, width, height
 * @param {Object} viewport - Viewport with x, y, width, height
 * @param {number} padding - Extra padding around viewport
 * @returns {boolean} True if rectangle intersects viewport
 */
export const isRectInViewport = (rect, viewport, padding = 0) => {
    return !(
        rect.x + rect.width < viewport.x - padding ||
        rect.x > viewport.x + viewport.width + padding ||
        rect.y + rect.height < viewport.y - padding ||
        rect.y > viewport.y + viewport.height + padding
    );
};

/**
 * Batch state updates to reduce re-renders
 * @param {Function} updateFunction - Function that performs state updates
 */
export const batchUpdates = (updateFunction) => {
    // In React 18+, updates are automatically batched
    // For older versions, we could use unstable_batchedUpdates
    updateFunction();
};

/**
 * Memory-efficient object pool for reusing objects
 */
export class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.used = new Set();
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    acquire() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        this.used.add(obj);
        return obj;
    }

    release(obj) {
        if (this.used.has(obj)) {
            this.used.delete(obj);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    releaseAll() {
        this.used.forEach(obj => {
            this.resetFn(obj);
            this.pool.push(obj);
        });
        this.used.clear();
    }

    getStats() {
        return {
            poolSize: this.pool.length,
            usedCount: this.used.size,
            totalCreated: this.pool.length + this.used.size
        };
    }
}
