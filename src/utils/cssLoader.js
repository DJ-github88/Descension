/**
 * CSS Loader Utility
 * Handles dynamic loading and cleanup of component-specific CSS to prevent interference
 */

class CSSLoader {
  constructor() {
    this.loadedStyles = new Map();
    this.componentCounts = new Map();
  }

  /**
   * Load CSS for a component with proper isolation
   * @param {string} componentName - Unique component identifier
   * @param {string[]} cssFiles - Array of CSS file paths to load
   * @param {string} isolationClass - CSS class for isolation container
   */
  loadComponentCSS(componentName, cssFiles, isolationClass = null) {
    // Increment component usage count
    const currentCount = this.componentCounts.get(componentName) || 0;
    this.componentCounts.set(componentName, currentCount + 1);

    // If already loaded, don't load again
    if (this.loadedStyles.has(componentName)) {
      return Promise.resolve();
    }

    const loadPromises = cssFiles.map(cssFile => {
      return new Promise((resolve, reject) => {
        // Check if this specific CSS file is already loaded
        const existingLink = document.querySelector(`link[href*="${cssFile}"]`);
        if (existingLink) {
          resolve();
          return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssFile;
        link.setAttribute('data-component', componentName);
        
        if (isolationClass) {
          link.setAttribute('data-isolation', isolationClass);
        }

        link.onload = () => {
          console.log(`✅ Loaded CSS for ${componentName}: ${cssFile}`);
          resolve();
        };
        
        link.onerror = () => {
          console.error(`❌ Failed to load CSS for ${componentName}: ${cssFile}`);
          reject(new Error(`Failed to load CSS: ${cssFile}`));
        };

        document.head.appendChild(link);
      });
    });

    // Store the loaded styles info
    this.loadedStyles.set(componentName, {
      cssFiles,
      isolationClass,
      loadTime: Date.now()
    });

    return Promise.all(loadPromises);
  }

  /**
   * Unload CSS for a component when no longer needed
   * @param {string} componentName - Component identifier
   */
  unloadComponentCSS(componentName) {
    const currentCount = this.componentCounts.get(componentName) || 0;
    
    if (currentCount <= 1) {
      // Remove CSS links from DOM
      const links = document.querySelectorAll(`link[data-component="${componentName}"]`);
      links.forEach(link => {
        console.log(`🗑️ Removing CSS for ${componentName}: ${link.href}`);
        link.remove();
      });

      // Clean up tracking
      this.loadedStyles.delete(componentName);
      this.componentCounts.delete(componentName);
    } else {
      // Decrement count
      this.componentCounts.set(componentName, currentCount - 1);
    }
  }

  /**
   * Add isolation wrapper to prevent CSS leakage
   * @param {HTMLElement} element - Element to wrap
   * @param {string} isolationClass - CSS class for isolation
   */
  addIsolationWrapper(element, isolationClass) {
    if (!element || element.classList.contains(isolationClass)) {
      return element;
    }

    element.classList.add(isolationClass);
    
    // Add CSS containment properties
    element.style.contain = 'layout style paint';
    element.style.isolation = 'isolate';
    
    return element;
  }

  /**
   * Remove isolation wrapper
   * @param {HTMLElement} element - Element to unwrap
   * @param {string} isolationClass - CSS class for isolation
   */
  removeIsolationWrapper(element, isolationClass) {
    if (!element) return;

    element.classList.remove(isolationClass);
    element.style.contain = '';
    element.style.isolation = '';
  }

  /**
   * Get currently loaded components
   */
  getLoadedComponents() {
    return Array.from(this.loadedStyles.keys());
  }

  /**
   * Force cleanup all CSS (emergency cleanup)
   */
  forceCleanupAll() {
    console.log('🧹 Force cleaning up all dynamic CSS');
    
    // Remove all component CSS links
    const allLinks = document.querySelectorAll('link[data-component]');
    allLinks.forEach(link => link.remove());

    // Clear tracking
    this.loadedStyles.clear();
    this.componentCounts.clear();
  }
}

// Create singleton instance
const cssLoader = new CSSLoader();

// Expose for debugging
if (typeof window !== 'undefined') {
  window.cssLoader = cssLoader;
}

export default cssLoader;
