// Polyfills for browser compatibility

// Immediate process polyfill - must be first to avoid circular references
(function() {
    'use strict';

    // Create a comprehensive process polyfill
    const processPolyfill = {
        env: {
            NODE_ENV: 'development',
            PUBLIC_URL: '',
            REACT_APP_OPENAI_API_KEY: '',
            BROWSER: true
        },
        browser: true,
        version: '16.0.0',
        versions: {
            node: '16.0.0'
        },
        platform: 'browser',
        arch: 'x64',
        title: 'browser',
        argv: [],
        argv0: 'node',
        execArgv: [],
        pid: 1,
        ppid: 0,
        nextTick: function(callback) {
            if (typeof callback === 'function') {
                setTimeout(callback, 0);
            }
        },
        cwd: function() {
            return '/';
        },
        chdir: function() {
            // No-op in browser
        },
        exit: function() {
            // No-op in browser
        },
        kill: function() {
            // No-op in browser
        },
        umask: function() {
            return 0;
        },
        uptime: function() {
            return 0;
        },
        hrtime: function() {
            return [0, 0];
        },
        memoryUsage: function() {
            return {
                rss: 0,
                heapTotal: 0,
                heapUsed: 0,
                external: 0
            };
        }
    };

    // Set up global immediately if it doesn't exist
    if (typeof window !== 'undefined') {
        if (typeof window.global === 'undefined') {
            window.global = window;
        }
        if (typeof global === 'undefined') {
            window.global = window;
        }

        // Set process in multiple ways to ensure it's available
        if (typeof window.process === 'undefined') {
            window.process = processPolyfill;
        }
        if (typeof window.global.process === 'undefined') {
            window.global.process = processPolyfill;
        }

        // Also try to set as direct global
        try {
            if (typeof process === 'undefined') {
                window.process = processPolyfill;
                window.global.process = processPolyfill;
            }
        } catch (e) {
            // Ignore errors, fallback is already set
        }
    }
})();

// Global polyfill - must be early
(function() {
    'use strict';

    if (typeof window !== 'undefined') {
        if (typeof window.global === 'undefined') {
            window.global = window;
        }

        // Ensure global is available on window
        if (typeof global === 'undefined') {
            window.global = window;
        }
    }
})();





// Buffer polyfill
(function() {
    'use strict';

    if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
        try {
            const bufferModule = require('buffer');
            window.Buffer = bufferModule.Buffer;
        } catch (e) {
            // Fallback if buffer is not available
            window.Buffer = {
                from: function(data) {
                    return new Uint8Array(data);
                },
                isBuffer: function() {
                    return false;
                },
                alloc: function(size) {
                    return new Uint8Array(size);
                }
            };
        }

        // Also set on global
        if (window.global) {
            window.global.Buffer = window.Buffer;
        }
    }
})();

// Additional polyfills for older browsers
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        return this.indexOf(searchElement, fromIndex) !== -1;
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

// Handle async listener errors (Chrome extension compatibility)
(function() {
    'use strict';

    if (typeof window !== 'undefined') {
        // Suppress async listener errors that can occur with browser extensions
        const originalAddEventListener = window.addEventListener;
        if (originalAddEventListener) {
            window.addEventListener = function(type, listener, options) {
                try {
                    return originalAddEventListener.call(this, type, listener, options);
                } catch (error) {
                    console.warn('Event listener error suppressed:', error);
                }
            };
        }

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            // Suppress certain types of errors that are common with browser extensions
            if (event.reason && typeof event.reason === 'string') {
                if (event.reason.includes('message channel closed') ||
                    event.reason.includes('Extension context invalidated')) {
                    event.preventDefault();
                    return;
                }
            }
        });

        // Handle runtime errors
        window.addEventListener('error', function(event) {
            // Suppress certain extension-related errors
            if (event.message && typeof event.message === 'string') {
                if (event.message.includes('Extension context invalidated') ||
                    event.message.includes('message channel closed')) {
                    event.preventDefault();
                    return;
                }
            }
        });
    }
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}
