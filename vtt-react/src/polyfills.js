// Polyfills for browser compatibility

// Immediate process polyfill - must be first to avoid circular references
(function() {
    'use strict';

    // Create a comprehensive process polyfill
    // Use webpack's DefinePlugin injected environment variables
    const processPolyfill = {
        env: {
            NODE_ENV: typeof process !== 'undefined' && process.env && process.env.NODE_ENV
                ? process.env.NODE_ENV
                : (typeof __NODE_ENV__ !== 'undefined' ? __NODE_ENV__ : 'development'),
            PUBLIC_URL: typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL
                ? process.env.PUBLIC_URL
                : '',
            REACT_APP_OPENAI_API_KEY: typeof process !== 'undefined' && process.env && process.env.REACT_APP_OPENAI_API_KEY
                ? process.env.REACT_APP_OPENAI_API_KEY
                : '',
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

// ULTIMATE TITLE POLYFILL - Addresses persistent "title is not defined" ReferenceError
(function() {
    'use strict';

    if (typeof window !== 'undefined') {
        // Define title in every possible scope and context

        // 1. Global window scope
        if (typeof window.title === 'undefined') {
            window.title = document.title || '';
        }

        // 2. Global scope via window.global
        if (window.global && typeof window.global.title === 'undefined') {
            window.global.title = document.title || '';
        }

        // 3. Direct global assignment (for closures and compiled code)
        try {
            // This might fail in strict mode, but we'll try anyway
            eval('var title = "' + (document.title || '').replace(/"/g, '\\"') + '";');
            eval('let titleLet = "' + (document.title || '').replace(/"/g, '\\"') + '";');
            eval('const titleConst = "' + (document.title || '').replace(/"/g, '\\"') + '";');
        } catch (e) {
            // Ignore errors in strict mode
        }

        // 4. Property descriptor with getter/setter
        try {
            Object.defineProperty(window, 'title', {
                get: function() {
                    return document.title || '';
                },
                set: function(value) {
                    document.title = value || '';
                },
                configurable: true,
                enumerable: true
            });
        } catch (e) {
            // Fallback if property descriptor fails
            window.title = document.title || '';
        }

        // 5. Ensure it's available in all common global contexts
        const globalContexts = [window, window.global, window.self, window.top];
        globalContexts.forEach(context => {
            if (context && typeof context.title === 'undefined') {
                try {
                    context.title = document.title || '';
                } catch (e) {
                    // Ignore cross-origin errors
                }
            }
        });

        // 6. Override any potential undefined references in React context
        if (window.React && window.React.createElement) {
            const originalCreateElement = window.React.createElement;
            window.React.createElement = function(type, props, ...children) {
                // Ensure title is always defined in React context
                if (typeof title === 'undefined') {
                    window.title = document.title || '';
                }
                return originalCreateElement.call(this, type, props, ...children);
            };
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

// Drag and Drop API polyfills for better browser compatibility
(function() {
    'use strict';

    if (typeof window !== 'undefined') {
        // Ensure DataTransfer constructor exists
        if (typeof window.DataTransfer === 'undefined') {
            window.DataTransfer = function() {
                this.data = {};
                this.types = [];
                this.files = [];
                this.effectAllowed = 'all';
                this.dropEffect = 'none';
            };

            window.DataTransfer.prototype.setData = function(type, data) {
                this.data[type] = data;
                if (this.types.indexOf(type) === -1) {
                    this.types.push(type);
                }
            };

            window.DataTransfer.prototype.getData = function(type) {
                return this.data[type] || '';
            };

            window.DataTransfer.prototype.clearData = function(type) {
                if (type) {
                    delete this.data[type];
                    const index = this.types.indexOf(type);
                    if (index > -1) {
                        this.types.splice(index, 1);
                    }
                } else {
                    this.data = {};
                    this.types = [];
                }
            };

            window.DataTransfer.prototype.setDragImage = function(img, x, y) {
                // Polyfill for setDragImage - basic implementation
                this._dragImage = { img: img, x: x, y: y };
            };
        }

        // Ensure drag events are properly supported
        const dragEvents = ['dragstart', 'drag', 'dragenter', 'dragover', 'dragleave', 'drop', 'dragend'];
        dragEvents.forEach(eventType => {
            if (!window.document.createEvent) return;

            try {
                const event = document.createEvent('DragEvent');
                if (!event.initDragEvent) {
                    // Fallback for browsers that don't support DragEvent
                    window.DragEvent = window.MouseEvent;
                }
            } catch (e) {
                // If DragEvent is not supported, use MouseEvent as fallback
                window.DragEvent = window.MouseEvent;
            }
        });

        // Touch event polyfills for mobile compatibility
        if (!window.TouchEvent && window.Touch) {
            window.TouchEvent = function(type, eventInitDict) {
                const event = document.createEvent('Event');
                event.initEvent(type, true, true);
                Object.assign(event, eventInitDict);
                return event;
            };
        }
    }
})();

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
