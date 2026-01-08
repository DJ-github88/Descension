/**
 * Utility to lazy load CSS files dynamically
 * This helps reduce initial bundle size by loading CSS only when needed
 */

const loadedStylesheets = new Set();

/**
 * Lazy load a CSS file
 * @param {string} cssPath - Path to CSS file (relative to src or absolute)
 * @returns {Promise<void>}
 */
export function lazyLoadCSS(cssPath) {
  // Check if already loaded
  if (loadedStylesheets.has(cssPath)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    // Check if stylesheet already exists in DOM
    const existingLink = document.querySelector(`link[href*="${cssPath}"]`);
    if (existingLink) {
      loadedStylesheets.add(cssPath);
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssPath;
    link.onload = () => {
      loadedStylesheets.add(cssPath);
      resolve();
    };
    link.onerror = () => {
      console.warn(`Failed to load CSS: ${cssPath}`);
      reject(new Error(`Failed to load CSS: ${cssPath}`));
    };
    document.head.appendChild(link);
  });
}

/**
 * Lazy load multiple CSS files
 * @param {string[]} cssPaths - Array of CSS file paths
 * @returns {Promise<void[]>}
 */
export function lazyLoadMultipleCSS(cssPaths) {
  return Promise.all(cssPaths.map(path => lazyLoadCSS(path).catch(() => {
    // Continue even if one fails
    console.warn(`Skipping failed CSS: ${path}`);
  })));
}

/**
 * Preload CSS file (hint to browser, doesn't block)
 * @param {string} cssPath - Path to CSS file
 */
export function preloadCSS(cssPath) {
  if (loadedStylesheets.has(cssPath)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = cssPath;
  link.onload = () => {
    link.rel = 'stylesheet';
  };
  document.head.appendChild(link);
}

